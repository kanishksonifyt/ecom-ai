import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import {
    PaymentProviderError,
    PaymentProviderSessionResponse,
    PaymentSessionStatus,
    UpdatePaymentProviderSession,
    ProviderWebhookPayload,
    WebhookActionResult,
    CreatePaymentProviderSession,
} from "@medusajs/types";
import axios from "axios";
import crypto from "crypto";

type Options = {
    merchantId: string;
    saltKey: string;
    saltIndex: string;
};

class PhonePePaymentProviderService extends AbstractPaymentProvider<Options> {
    options: Options;

    async initiatePayment(context: CreatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
        try {
            const payload = {
                merchantId: this.options.merchantId,
                transactionId: context.paymentSessionData.transactionId,
                amount: context.amount,
                instrumentType: "PHONEPE",
            };

            const checksum = this.generateChecksum(JSON.stringify(payload));
            const response = await axios.post(`${this.baseUrl}/initiate`, payload, {
                headers: {
                    ...this.headers,
                    "X-VERIFY": `${checksum}###${this.options.saltIndex}`,
                },
            });

            return {
                status: "initiated" as PaymentSessionStatus,
                data: response.data,
            };
        } catch (error) {
            return { message: error.message } as PaymentProviderError;
        }
    }
  deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
      throw new Error("Method not implemented.");
  }
  private baseUrl = "https://api.phonepe.com/apis/pg/v1";
  private headers = {
    "Content-Type": "application/json",
  };

  private generateChecksum(payload: string): string {
    const { saltKey } = this.options;
    return crypto.createHash("sha256").update(payload + saltKey).digest("base64");
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: PaymentProviderSessionResponse["data"] }> {
    try {
      const payload = {
        merchantId: this.options.merchantId,
        transactionId: paymentSessionData.transactionId,
        amount: paymentSessionData.amount,
        instrumentType: "PHONEPE",
      };

      const checksum = this.generateChecksum(JSON.stringify(payload));
      const response = await axios.post(`${this.baseUrl}/pay`, payload, {
        headers: {
          ...this.headers,
          "X-VERIFY": `${checksum}###${this.options.saltIndex}`,
        },
      });

      return {
        status: "authorized" as PaymentSessionStatus,
        data: response.data,
      };
    } catch (error) {
      return { message: error.message } as PaymentProviderError;
    }
  }

  async capturePayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const payload = {
        merchantId: this.options.merchantId,
        transactionId: paymentData.transactionId,
        amount: paymentData.amount,
      };

      const checksum = this.generateChecksum(JSON.stringify(payload));
      const response = await axios.post(`${this.baseUrl}/capture`, payload, {
        headers: {
          ...this.headers,
          "X-VERIFY": `${checksum}###${this.options.saltIndex}`,
        },
      });

      return response.data;
    } catch (error) {
      return { message: error.message } as PaymentProviderError;
    }
  }

  async refundPayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const payload = {
        merchantId: this.options.merchantId,
        transactionId: paymentData.transactionId,
        refundId: paymentData.refundId,
        amount: paymentData.amount,
      };

      const checksum = this.generateChecksum(JSON.stringify(payload));
      const response = await axios.post(`${this.baseUrl}/refund`, payload, {
        headers: {
          ...this.headers,
          "X-VERIFY": `${checksum}###${this.options.saltIndex}`,
        },
      });

      return response.data;
    } catch (error) {
      return { message: error.message } as PaymentProviderError;
    }
  }

  async cancelPayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const payload = {
        merchantId: this.options.merchantId,
        transactionId: paymentData.transactionId,
      };

      const checksum = this.generateChecksum(JSON.stringify(payload));
      const response = await axios.post(`${this.baseUrl}/cancel`, payload, {
        headers: {
          ...this.headers,
          "X-VERIFY": `${checksum}###${this.options.saltIndex}`,
        },
      });

      return response.data;
    } catch (error) {
      return { message: error.message } as PaymentProviderError;
    }
  }

  async getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
    try {
      const payload = {
        merchantId: this.options.merchantId,
        transactionId: paymentSessionData.transactionId,
      };

      const checksum = this.generateChecksum(JSON.stringify(payload));
      const response = await axios.get(`${this.baseUrl}/status`, {
        headers: {
          ...this.headers,
          "X-VERIFY": `${checksum}###${this.options.saltIndex}`,
        },
      });

      return response.data.status as PaymentSessionStatus;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const payload = {
        merchantId: this.options.merchantId,
        transactionId: paymentSessionData.transactionId,
      };

      const checksum = this.generateChecksum(JSON.stringify(payload));
      const response = await axios.get(`${this.baseUrl}/retrieve`, {
        headers: {
          ...this.headers,
          "X-VERIFY": `${checksum}###${this.options.saltIndex}`,
        },
      });

      return response.data;
    } catch (error) {
      return { message: error.message } as PaymentProviderError;
    }
  }

  async updatePayment(context: UpdatePaymentProviderSession): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    // Implement logic for updating a payment if applicable.
    throw new Error("Method not implemented.");
  }

  async getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    // Parse the webhook payload and implement the appropriate logic.
    throw new Error("Method not implemented.");
  }
}

export default PhonePePaymentProviderService;
