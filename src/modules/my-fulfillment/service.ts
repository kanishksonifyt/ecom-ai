import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import axios, { AxiosInstance, AxiosError } from "axios";
import { Logger } from "@medusajs/medusa/types";
import { FulfillmentOption } from "@medusajs/framework/types";
import {
  CreateShippingOptionDTO,
  CalculateShippingOptionPriceDTO,
  CalculatedShippingOptionPrice,
} from "@medusajs/framework/types";
import ShiprocketClient from "./helper/index";

interface ShiprocketError extends Error {
  response?: {
    data?: any;
    status?: number;
  };
}

type InjectedDependencies = {
  logger: Logger;
};

interface ShiprocketOptions {
  email: string;
  password: string;
  base_url: string;
  hasRates: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  tokenRefreshInterval?: number;
}

interface ShiprocketService {
  id: number;
  name: string;
  code: string;
  estimated_delivery_days?: number;
  rate?: number;
}

class ShiprocketFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "shiprocket-fulfillment";

  private logger_: Logger;
  private options_: ShiprocketOptions;
  private authToken: string | null = null;
  private client: ShiprocketClient;
  private tokenExpiryTime: number | null = null;
  private requestQueue: Promise<any> = Promise.resolve();

  constructor({ logger }: InjectedDependencies, options: ShiprocketOptions) {
    super();
    this.logger_ = logger;
    this.options_ = {
      ...options,
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 1000,
      tokenRefreshInterval: options.tokenRefreshInterval || 10000000,
    };

    this.client = new ShiprocketClient({
      email: this.options_.email,
      password: this.options_.password,
      baseUrl: this.options_.base_url,
    });

    // Initialize token refresh interval
    this.setupTokenRefresh();
  }

  private setupTokenRefresh(): void {
    setInterval(() => {
      this.authenticate().catch((error) => {
        this.logger_.error("Token refresh failed:", error);
      });
    }, this.options_.tokenRefreshInterval);
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    attempts: number = this.options_.retryAttempts ?? 3
  ): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) throw error;

        const delay = (this.options_.retryDelay ?? 1000) * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (error.response?.status === 401) {
          await this.authenticate();
          throw new Error(
            `Failed to calculate shipping prices: ${JSON.stringify(data)}`
          );
        }
      }
    }
    throw new Error("Operation failed after multiple attempts");
  }

  async authenticate(): Promise<void> {
    this.logger_.debug(`Authenticating with Shiprocket API`);
    this.authToken = await this.client.authenticate();
  }

  private async makeRequest<T>(
    method: string,
    url: string,
    data: any = null,
    retryCount: number = this.options_.retryAttempts ?? 3
  ): Promise<T> {
    // Queue the request to prevent race conditions
    return new Promise((resolve, reject) => {
      this.requestQueue = this.requestQueue.then(async () => {
        try {
          this.logger_.debug(`1`);

          await this.authenticate();

          this.logger_.debug(
            `Making Shiprocket API request: ${url}, Auth Token: ${this.authToken}`
          );

          const response = await this.retryOperation(async () => {
            return await axios({
              method,
              url: `${this.options_.base_url}${url}`,
              headers: {
                Authorization: `Bearer ${this.authToken}`,
                "Content-Type": "application/json",
              },
              data,
            });
          }, retryCount);

          this.logger_.debug(
            `Shiprocket API request successful: ${this.options_.base_url} ${url}`
          );

          resolve(response.data);
        } catch (error) {
          const shiprocketError = error as any;
          this.logger_.error(
            `Shiprocket API request failed: ${this.options_.base_url} ${url}`,
            new Error(shiprocketError.message)
          );
          reject(shiprocketError);
        }
      });
    });
  }

  async createFulfillment(
    order: Record<string, any>,
    items: Record<string, any>[],
    customData: Record<string, any> = {}
  ): Promise<any> {
    try {
      // this.logger_.debug(`Creating Shiprocket fulfillment for order ${order}`);
      const orderData = this.prepareOrderData(order, items);



      const shiprocketOrder = await this.makeRequest<any>(
        "POST",
        "/orders/create/adhoc",
        orderData
      );

      return {
        ...shiprocketOrder,
        fulfillment_id: shiprocketOrder.order_id,
        tracking_number: shiprocketOrder.shipment_id,
        tracking_url: shiprocketOrder.tracking_url,
      };
    } catch (error) {
      this.logger_.debug(
        `Failed to create fulfillment: 
        
        for order ${JSON.stringify(order)}`
      );
    }
  }

  async cancelFulfillment(fulfillment: Record<string, any>): Promise<any> {
    if (!fulfillment.shiprocket_order_id) {
      throw new Error("Shiprocket order ID is required for cancellation");
    }

    try {
      return await this.makeRequest<any>(
        "POST",
        `/orders/cancel/${fulfillment.shiprocket_order_id}`,
        {
          cancellation_reason:
            fulfillment.cancellation_reason || "Order cancelled by customer",
        }
      );
    } catch (error) {
      throw new Error(`Failed to cancel fulfillment: ${error.message}`);
    }
  }

  async validateFulfillmentData(
    optionData: any,
    data: any,
    context: any
  ): Promise<any> {
    // assuming your client retrieves an ID from the
    // third-party service
    
    this.logger_.debug(`Validating Shiprocket fulfillment data for order ${data}`);

    return {
      ...data,
    }
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    try {
      const services = [
        {
          id: 1,
          name: "Express",
          code: "EXPRESS",
          estimated_delivery_days: 5,
          rate: 50,
        },
        {
          id: 2,
          name: "Standard",
          code: "STANDARD",
          estimated_delivery_days: 6,
          rate: 30,
        },
      ];

      return services.map((service) => ({
        id: service.id.toString(),
        name: service.name,
        service_code: service.code,
        metadata: {
          estimated_delivery_days: service.estimated_delivery_days,
          base_rate: service.rate,
        },
      }));
    } catch (error) {
      this.logger_.error(
        "Failed to fetch Shiprocket fulfillment options:",
        error
      );
      return [];
    }
  }

  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice> {
    try {
      this.logger_.debug(`Calculating shipping price for order ${data}`);
      const rateData = {
        pickup_postcode: 485881,
        delivery_postcode: 302033,
        weight: 0.3,
        cod: data?.payment_method ? data?.payment_method === "cod" : false,
      };

      // const response = await this.makeRequest<any>(
      //   "POST",
      //   "/courier/rate",
      //   rateData
      // );

      this.logger_.debug(`Calculated shipping price: ${data}`);

      // const totalDistance = 794; // Approximate km
      // const perKmCharge = response.rate / totalDistance;

      // this.logger_.debug(`Calculated shipping price: ${response.rate}`);

      return {
        calculated_amount: 2,
        is_calculated_price_tax_inclusive: true,
      };
    } catch (error) {
      this.logger_.info(
        `Failed to calculate shipping prices: ${JSON.stringify(error)}`
      );
      return {
        calculated_amount: 0,
        is_calculated_price_tax_inclusive: false,
      };
    }
  }

  private prepareOrderData(orders: any, items: any[]): Record<string, any> {
    const order = items[0]; // assuming you are processing only the first item
  
    // Log the payload for debugging
    this.logger_.debug(`Preparing Shiprocket order data: ${JSON.stringify(order)}`);
  
    const orderData = {
      order_id: order.id,
      order_date: new Date(order.created_at)
        .toISOString()
        .replace("T", " ")
        .substring(0, 19),
      pickup_location: "Primary",
      channel_id: 5921327,
      comment: "",
      reseller_name: "Majestic peacock",
      company_name: "Majestic peacock",
      shipping_is_billing: true,
      shipping_customer_name: order.shipping_address?.first_name || "",
      shipping_last_name: order.shipping_address?.last_name || "",
      shipping_address: order.shipping_address?.address_1 || "",
      shipping_address_2: order.shipping_address?.address_2 || "",
      shipping_city: order.shipping_address?.city || "",
      shipping_pincode: order.shipping_address?.postal_code || "",
      shipping_country: order.shipping_address?.country_code || "",
      shipping_state: order.shipping_address?.province || "",
      shipping_email: order.shipping_address?.email || "",
      is_billing_same_as_bi: true,
      shipping_phone: order.shipping_address?.phone || "",
      order_items: this.prepareOrderItems(items),
      shipping_charges: order.shipping_total || 20,
      giftwrap_charges: "",
      payment_method: order.payment_method || "",
      transaction_charges: "",
      total_discount: order.discount_total || 0,
      sub_total: order.subtotal || 0,
      length: this.prepareDimensions(order)?.length || 0,
      breadth: this.prepareDimensions(order)?.breadth || 0,
      height: this.prepareDimensions(order)?.height || 0,
      weight: this.prepareDimensions(order)?.weight || 0,
    };

  //   {
  //     "order_id": "ORD134545",
      
  //     "order_date": "2025-01-29",
  //     "pickup_location": "Primary",
  //     "channel_id": 5921327,
  //     "reseller_name": "ABC Resellers",
  //     "company_name": "XYZ Pvt Ltd",
  //     "billing_customer_name": "John",
  //     "billing_last_name": "Doe",
  //     "billing_address": "1234 Elm Street",
  //     "billing_address_2": "Apt 56",
  //     "billing_isd_code": "+91",
  //     "billing_city": "Mumbai",
  //     "billing_pincode": "400001",
  //     "billing_state": "Maharashtra",
  //     "billing_country": "India",
  //     "billing_email": "johndoe@example.com",
  //     "billing_phone": "9123456789",
  //     "billing_alternate_phone": "9876543210",
  //     "shipping_is_billing": true,
  //     "shipping_customer_name": "John",
  //     "shipping_last_name": "Doe",
  //     "shipping_address": "1234 Elm Street",
  //     "shipping_address_2": "Apt 56",
  //     "shipping_city": "Mumbai",
  //     "shipping_pincode": "400001",
  //     "shipping_country": "India",
  //     "shipping_state": "Maharashtra",
  //     "shipping_email": "johndoe@example.com",
  //     "shipping_phone": "9123456789",
  //     "order_items": [
  //         {
  //             "name": "Laptop",
  //             "sku": "LAP12345",
  //             "units": 1,
  //             "selling_price": "1000.00",
  //             "discount": "80.00",
  //             "tax": "18.00",
  //             "hsn": "84713010"
  //         }
  //     ],
  //     "payment_method": "Credit Card",
  //     "shipping_charges": "20.00",
  //     "total_discount": "8.00",
  //     "sub_total": "20.00",
  //     "length": "15",
  //     "breadth": "10",
  //     "height": "2",
  //     "weight": "2.5",
  //     "invoice_number": "INV123456"
      
  // }
  
  
    // Log the final payload
    this.logger_.debug(`Final Shiprocket order payload: ${JSON.stringify(orderData)}`);
  
    return orderData;
  }
  
  private isShippingSameAsBilling(order: any): boolean {
    const billing = order.billing_address;
    const shipping = order.shipping_address;

    if (!billing || !shipping) return false;

    return (
      billing.address_1 === shipping.address_1 &&
      billing.city === shipping.city &&
      billing.postal_code === shipping.postal_code &&
      billing.country_code === shipping.country_code
    );
  }

  private prepareOrderItems(items: any[]): any[] {
    return items.map((item) => ({
      name: item.title,
      sku: item.sku,
      units: parseInt(item.quantity, 1),
      selling_price: parseInt(item.unit_price),
      discount: parseInt(item.discount_amount),
      tax: parseInt(item.tax_amount),
      hsn: item.metadata?.hsn_code,
    }));
  }

  private prepareDimensions(order: any): Record<string, any> {
    return {
      length: order.metadata?.dimensions?.length || 0,
      breadth: order.metadata?.dimensions?.width || 0,
      height: order.metadata?.dimensions?.height || 0,
      weight: order.metadata?.dimensions?.weight || 0,
    };
  }

  private cleanOrderData(data: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== "") {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }

  async canCalculate(data: Record<string, unknown>): Promise<boolean> {
    console.log(data);

    return true;
  }
}

export default ShiprocketFulfillmentService;
