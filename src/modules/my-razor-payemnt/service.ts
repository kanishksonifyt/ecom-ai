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
import { Logger } from "@medusajs/framework/types";

const razorpay = new Razorpay({
  key_id: "rzp_test_v9OipkUZNTnkXj", // Replace with your Razorpay Key ID
  key_secret: "ihJ2uNbLuoKHDrJoLIpTBltO", // Replace with your Razorpay Key Secret
});

type Options = {
  apiKey: "rzp_test_v9OipkUZNTnkXj";
};

const countryToCurrency = {
  IN: "inr", // India
  US: "USD", // United States
  GB: "GBP", // United Kingdom
  // Add more mappings as needed
};

type InjectedDependencies = {
  logger: Logger;
};

class MyRazorPayemntgateway extends AbstractPaymentProvider<Options> {
  static identifier = "razorpay";

  protected logger_: Logger;
  protected options_: Options;
  // assuming you're initializing a client
  protected client;

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options);

    this.logger_ = container.logger;
    this.options_ = options;
  }
  async capturePayment(
    paymentData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    console.log( paymentData , )
    const paymentId = paymentData.paymentId as string; // Get the payment ID from the function parameter
    const amount = paymentData.amount as number; // Get the amount from the function parameter

    try {
      const payment = await razorpay.payments.capture(paymentId, amount);
      console.log("Payment captured successfully:", payment);
      return payment;
    } catch (error) {
      console.error("Error capturing payment:", error);
      throw error;
    }
  }

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
      const paymentId = paymentSessionData.id as string;
      const amount = paymentSessionData.amount as number;

      if (!paymentId || !amount) {
        throw new Error("Invalid payment session data. Missing ID or amount.");
      }

      return {
        status: "pending",
        data: {
          id: paymentId,
          amount,
        },
      };
    } catch (error) {
      console.error("Error during authorizePayment:", error);

      return {
        status: "error",
        data: {
          errorMessage:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      };
    }
  }

  async cancelPayment(
    paymentData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const externalId = paymentData.id as string;

    try {
      const payment = await razorpay.payments.fetch(externalId);
      const canceledPayment = await razorpay.payments.refund(payment.id, {
        amount: payment.amount,
      });
      console.log("Payment canceled successfully:", canceledPayment);
      return canceledPayment;
    } catch (error) {
      console.error("Error canceling payment:", error);
      throw error;
    }
  }

  async initiatePayment(
    Context: any
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    console.log("Initiate Payment Context:", Context);

    let currency: string;
    try {
      const {
        amount,
        currency_code: currency,
        context: { session_id: receipt },
      } = Context;

      if (!amount || !currency || !receipt) {
        throw new Error(
          `Invalid data: amount=${amount}, currency=${currency}, receipt=${receipt}`
        );
      }

      // Map country code to currency code (if necessary)
      const currencyMapped = countryToCurrency[currency] || currency;

      if (!currencyMapped) {
        throw new Error(`Unsupported currency code: ${currency}`);
      }

      const amountInPaise = Math.round(Number(amount) * 100); // Convert to paise (smallest currency unit)

      const options = {
        amount: amountInPaise, // Amount in paise
        currency: currencyMapped.toUpperCase(), // Currency code in uppercase
        receipt,
        payment_capture: 0, // Auto-capture payments (1 to enable, 0 for manual capture)
      };

      const razorpay = new Razorpay({
        key_id: "rzp_test_v9OipkUZNTnkXj", // Replace with your Razorpay Key ID
        key_secret: "ihJ2uNbLuoKHDrJoLIpTBltO", // Replace with your Razorpay key secret
      });

      const order = await razorpay.orders.create(options);
      console.log("Razorpay Order:", order);

      return {
        data: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        },
      };
    } catch (error) {
      console.error("Error initiating payment:", error);
      throw new Error("Internal Server Error");
    }
  }

  async refundPayment(
    paymentData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const paymentId = paymentData.paymentId as string;

    try {
      const payment = await razorpay.payments.fetch(paymentId);
      const refundedPayment = await razorpay.payments.refund(payment.id, {
        amount: refundAmount * 100, // Refund amount in smallest unit (e.g., paise for INR)
      });
      console.log("Payment refunded successfully:", refundedPayment);
      return refundedPayment;
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    const externalId = paymentSessionData.id as string;

    try {
      const payment = await razorpay.payments.fetch(externalId);

      // Mapping Razorpay payment statuses to PaymentSessionStatus
      switch (payment.status) {
        case "captured":
          return "captured"; // Payment successfully captured
        case "authorized":
          return "authorized"; // Payment authorized but not yet captured
        case "created":
        case "pending":
          return "pending"; // Payment still pending
        case "failed":
          return "error"; // Payment failed
        case "cancelled":
          return "canceled"; // Payment canceled
        default:
          return "requires_more"; // Payment needs more actions
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw new Error("Unable to fetch payment status.");
    }
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      console.log("deletePayment method called with:", paymentSessionData);
      // Add your logic for deleting a payment session if needed
      return Promise.resolve({
        status: "success", // Adjust based on your logic
        data: {}, // Replace with relevant data
      });
    } catch (error) {
      console.error("Error in deletePayment:", error);
      throw new Error("Failed to delete payment session.");
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const paymentId = paymentSessionData.paymentId as string;

    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error("Error retrieving payment:", error);
      throw error;
    }
  }

  async updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    // Handle any updates to an existing payment session, e.g., change payment status, etc.
    return { data: context.data }; // Example update, return the updated session data
  }

  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    try {
      const { event, payload } = data;
      const paymentDetails = payload?.payment;

      if (!event || !paymentDetails) {
        throw new Error("Invalid webhook payload");
      }

      switch (event) {
        case "payment.captured":
          return {
            action: "capture",
            data: paymentDetails,
          };
        case "payment.failed":
          return {
            action: "fail",
            data: paymentDetails,
          };
        default:
          return {
            action: "unknown",
            data: paymentDetails,
          };
      }
    } catch (error) {
      console.error("Error handling webhook action:", error);
      throw new Error("Failed to process webhook data.");
    }
  }
}

export default MyRazorPayemntgateway;