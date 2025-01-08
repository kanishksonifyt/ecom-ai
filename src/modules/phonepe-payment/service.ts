import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import { PaymentProviderError, PaymentProviderSessionResponse, PaymentSessionStatus, UpdatePaymentProviderSession, ProviderWebhookPayload, WebhookActionResult } from "@medusajs/types";
import axios from "axios";

type Options = {
  merchantId: string;
  saltKey: string;
  saltIndex: number;
};

class PhonePePaymentProviderService extends AbstractPaymentProvider<Options> {
  cancelPayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
      throw new Error("Method not implemented.");
  }
  deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
      throw new Error("Method not implemented.");
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
  getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
      throw new Error("Method not implemented.");
  }
  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: PaymentProviderSessionResponse["data"] }> {
    // Implement authorization logic
    return {
      status: "authorized" as PaymentSessionStatus,
      data: {}
    };
  }

  async capturePayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    // Implement capture logic
    return {};
  }

  async refundPayment(paymentData: Record<string, unknown>): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    // Implement refund logic
    return {};
  }

  public async initiatePayment(paymentData: Record<string, unknown>) {
    // Implement the logic to initiate payment using PhonePe's API
    const response = await axios.post("https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", paymentData);
    return response.data;
  }
}

export default PhonePePaymentProviderService;
