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
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_v9OipkUZNTnkXj", // Replace with your Razorpay Key ID
  key_secret: "ihJ2uNbLuoKHDrJoLIpTBltO", // Replace with your Razorpay Key Secret
});

type Options = {
  apiKey: "rzp_test_v9OipkUZNTnkXj";
};

class MyPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "rozarpay";
  capturePayment(
    paymentData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const paymentId = paymentData.paymentId as string; // Get the payment ID from the function parameter
    const amount = paymentData.amount as number; // Get the amount from the function parameter

    return razorpay.payments
      .capture(paymentId, amount)
      .then((payment) => {
        console.log("Payment captured successfully:", payment);
        // Handle the captured payment details here
        return payment;
      })
      .catch((error) => {
        console.error("Error capturing payment:", error);
        // Handle the error appropriately
        throw error;
      });
  }
  authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProviderError
    | {
        status: PaymentSessionStatus;
        data: PaymentProviderSessionResponse["data"];
      }
  > {
    throw new Error("Method not implemented.");
  }
  cancelPayment(
    paymentData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.");
  }
  initiatePayment(
    context: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    throw new Error("Method not implemented.");
  }
  deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.");
  }
  getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.");
  }
  refundPayment(
    paymentData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.");
  }
  retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    throw new Error("Method not implemented.");
  }
  updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    throw new Error("Method not implemented.");
  }
  getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    throw new Error("Method not implemented.");
  }
}

export default {
  services: [MyPaymentProviderService],
};
