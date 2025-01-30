import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import {
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  CreatePaymentProviderSession,
  UpdatePaymentProviderSession,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/types";
import { Logger } from "@medusajs/framework/types";
import axios from "axios";
import crypto from "crypto";

type Options = {
  merchantId: string;
  saltKey: string;
  saltIndex: string;
  env: "sandbox" | "production";
};

type InjectedDependencies = {
  logger: Logger;
};

class PhonePePaymentGateway extends AbstractPaymentProvider<Options> {
  async deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const transactionId = paymentSessionData.transactionId as string;
      const payload = {
        merchantId: this.options_.merchantId,
        merchantTransactionId: transactionId,
        reason: "User requested deletion",
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
      const signature = this.generateSignature(base64Payload);

      const response = await axios.post(
        `${this.baseUrl}/pg/v1/delete`,
        {
          request: base64Payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": signature,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger_.error("Delete payment error:", error);
      throw new Error("Payment deletion failed");
    }
  }
  getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.");
  }
  retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.");
  }
  updatePayment(context: UpdatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    throw new Error("Method not implemented.");
  }
  // Constructor
  constructor(container: InjectedDependencies, options: Options) {
    super(container, options);
    this.logger_ = container.logger;
    this.options_ = options;
    this.baseUrl =
      this.options_.env === "sandbox"
        ? "https://api-preprod.phonepe.com/apis/pg-sandbox"
        : "https://api.phonepe.com/apis/hermes";
  }

  protected logger_: Logger;
  protected options_: Options;
  private baseUrl: string;

  static identifier = "phonepe";

  // Signature Generation
  private generateSignature(payload: string): string {
    // Step 1: Create checksum (SHA256) of concatenated string
    const checksumString = payload + this.options_.saltIndex; // Corrected
    const checksum = crypto
      .createHash("sha256")
      .update(checksumString)
      .digest("hex");

    // Step 2: Generate X-VERIFY header using HMAC-SHA256 of the checksum with salt key
    const xVerify = crypto
      .createHmac("sha256", this.options_.saltKey)
      .update(checksum)
      .digest("hex") + "###" + this.options_.saltIndex;

    return xVerify;
  }

  // Cancel Payment
  async cancelPayment(
    paymentData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const transactionId = paymentData.transactionId as string;
      const payload = {
        merchantId: this.options_.merchantId,
        merchantTransactionId: transactionId,
        reason: "User requested cancellation",
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
        "base64"
      );
      const signature = this.generateSignature(base64Payload);

      const response = await axios.post(
        `${this.baseUrl}/pg/v1/cancel`,
        {
          request: base64Payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": signature,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger_.error("Cancel payment error:", error);
      throw new Error("Payment cancellation failed");
    }
  }

  // Initiate Payment
  async initiatePayment(
    context: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    try {
      const {
        amount,
        currency_code,
        context: { session_id },
      } = context as {
        amount: number;
        currency_code: string;
        context: { session_id: string };
      };

      const transactionId = `TXN_${Date.now()}`;
      this.logger_.info(
        `Initiating PhonePe payment for session: ${session_id} with transaction ID: ${transactionId} , base URL: ${this.baseUrl}`
      );

      const payload = {
        merchantId: this.options_.merchantId,
        merchantTransactionId: transactionId,
        amount: amount * 100, // Convert to paise
        redirectUrl: `${process.env.BASE_URL}/payment-callback`,
        redirectMode: "POST",
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
        "base64"
      );
      const signature = this.generateSignature(base64Payload);

      const response = await axios.post(
        `${this.baseUrl}/pg/v1/pay`,
        {
          request: base64Payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": signature,
          },
        }
      );

      const data = response.data.data;
      return {
        data: {
          paymentUrl: data.instrumentResponse.redirectInfo.url,
          transactionId: transactionId,
          merchantId: this.options_.merchantId,
          status: data.state,
        },
      };
    } catch (error) {
      this.logger_.error("PhonePe initiation error:", error);
      throw new Error("Payment initiation failed");
    }
  }

  // Capture Payment
  async capturePayment(
    paymentData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const transactionId = paymentData.transactionId as string;
      const response = await axios.get(
        `${this.baseUrl}/pg/v1/status/${this.options_.merchantId}/${transactionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": this.generateSignature(
              `/pg/v1/status/${this.options_.merchantId}/${transactionId}`
            ),
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger_.error("PhonePe capture error:", error);
      throw new Error("Payment capture failed");
    }
  }

  // Authorize Payment
  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProviderError
    | {
        status: PaymentSessionStatus;
        data: Record<string, unknown>;
      }
  > {
    try {
      const callbackData = context.callbackData as {
        response: string;
        headers: { "x-verify": string };
      };

      const signature = this.generateSignature(callbackData.response);

      if (signature !== callbackData.headers["x-verify"]) {
        throw new Error("Invalid signature");
      }

      const decodedResponse = JSON.parse(
        Buffer.from(callbackData.response, "base64").toString()
      );

      return {
        status:
          decodedResponse.code === "PAYMENT_SUCCESS" ? "captured" : "error",
        data: decodedResponse,
      };
    } catch (error) {
      this.logger_.error("Authorization error:", error);
      return {
        status: "error",
        data: { error: error.message },
      };
    }
  }

  // Refund Payment
  async refundPayment(
    paymentData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const transactionId = paymentData.transactionId as string;
      const refundId = `REFUND_${Date.now()}`;

      const payload = {
        merchantId: this.options_.merchantId,
        merchantTransactionId: refundId,
        originalTransactionId: transactionId,
        amount: refundAmount * 100,
        callbackUrl: `${process.env.BASE_URL}/refund-callback`,
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
        "base64"
      );
      const signature = this.generateSignature(base64Payload);

      const response = await axios.post(
        `${this.baseUrl}/pg/v1/refund`,
        {
          request: base64Payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": signature,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger_.error("Refund error:", error);
      throw new Error("Refund processing failed");
    }
  }

  // Webhook Action and Data
  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    try {
      const signature = this.generateSignature(data.rawData as string);
      if (signature !== data.headers["x-verify"]) {
        throw new Error("Invalid webhook signature");
      }

      const decodedData = JSON.parse(
        Buffer.from(data.rawData as string, "base64").toString()
      );
      return {
        action: decodedData.event,
        data: decodedData,
      };
    } catch (error) {
      this.logger_.error("Webhook error:", error);
      return {
        action: "payment_failed" as any,
        data: { session_id: "", amount: 0 },
      };
    }
  }
}

export default PhonePePaymentGateway;
