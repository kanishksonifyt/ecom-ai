import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import axios from "axios";
import { Logger } from "@medusajs/medusa/types";
import { FulfillmentOption } from "@medusajs/framework/types";
import { AxiosInstance } from "axios";
import ShiprocketClient from "./helper/index";
import { CreateShippingOptionDTO , CalculateShippingOptionPriceDTO , CalculatedShippingOptionPrice } from "@medusajs/framework/types";

type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  email: string;
  password: string;
  base_url: string;
  hasRates: boolean;
};

class ShiprocketFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "shiprocket-fulfillment";
  private logger_: Logger;
  private options_: Options;
  private authToken: string | null = null;
  private client: ShiprocketClient;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();
    this.logger_ = logger;
    this.options_ = options;

    this.client = new ShiprocketClient({  
      email: this.options_.email,
      password: this.options_.password,
      baseUrl: this.options_.base_url,
      
    });
  }

  private async authenticate(): Promise<void> {
   this.client.authenticate();
  }

  private async makeRequest(method: string, url: string, data: any = {}) {
    if (!this.authToken) {
      await this.authenticate();
    }
    try {
      const response = await axios({
        method,
        url: `${this.options_.base_url}${url}`,
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
        data,
      });
      return response.data;
    } catch (error) {
      this.logger_.error(`Request to ${url} failed`, error);
      throw new Error(`Request to ${url} failed`);
    }
  }

  async createFulfillment(order, items, customData = {}): Promise<any> {
    const orderData = this.prepareOrderData(order, items);
    const shiprocketOrder = await this.makeRequest(
      "POST",
      "/v1/external/orders/create/adhoc",
      orderData
    );
    // Handle the response and update Medusa order fulfillment status
    return shiprocketOrder;
  }

  async cancelFulfillment(fulfillment): Promise<any> {
    const shiprocketOrderId = fulfillment.shiprocket_order_id;
    const cancellationResponse = await this.makeRequest(
      "POST",
      `/v1/external/orders/cancel/${shiprocketOrderId}`
    );
    // Handle the response and update Medusa order fulfillment status
    return cancellationResponse;
  }

  async getFulfillmentDocuments(fulfillment): Promise<any> {
    const shipmentId = fulfillment.shiprocket_shipment_id;
    const label = await this.makeRequest(
      "POST",
      `/v1/external/courier/generate/label`,
      { shipment_id: shipmentId }
    );
    const invoice = await this.makeRequest(
      "POST",
      `/v1/external/orders/print/invoice`,
      { order_id: fulfillment.order_id }
    );
    // Return or process the documents as needed
    return { label, invoice };
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    try {
      // Call the Shiprocket API to get the available services
      const services = [
        {
          id: 1,
          name: "Standard Shipping",
          code: "standard",
        },
        {
          id: 2,
          name: "Express Shipping",
          code: "express",
        },
      ]
  
      // Map the services to FulfillmentOption structure
      return services.map((service: any) => ({
        id: service.id,
        name: service.name,
        service_code: service.code,

      }));
    } catch (error) {
      this.logger_.error("Failed to fetch fulfillment options from Shiprocket", error);
  
      // If error.response exists, log the response for better debugging
      if (error.response) {
        this.logger_.error("Shiprocket API error response:", error.response.data);
      }
      
      throw new Error("Failed to fetch fulfillment options from Shiprocket");
    }
  }
  
  

  private prepareOrderData(order, items): any {
    // Map Medusa order and items to Shiprocket's order structure
    return {
      // Populate with necessary fields
    };
  }

 
  async canCalculate(data: Record<string, unknown>): Promise<boolean> {    
    // assuming you have a client
    return true;
  }

  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice> {
    // assuming the client can calculate the price using
    // the third-party service
    const price = 100;
    return {
      calculated_amount: price,
      // Update this boolean value based on your logic
      is_calculated_price_tax_inclusive: true,
    }
  }

  // async canCalculate(option: FulfillmentOption): Promise<boolean> {
  //   try {
  //     const { pickup_postcode, delivery_postcode, cod, weight } = option;

  //     const params = {
  //       pickup_postcode,
  //       delivery_postcode,
  //       cod,
  //       weight,
  //     };

  //     this.logger_.info(`Checking serviceability with options: ${JSON.stringify(params)}`);

  //     const response = await this.makeRequest(
  //       "GET",
  //       `/v1/external/courier/serviceability/?pickup_postcode=${pickup_postcode}&delivery_postcode=${delivery_postcode}&cod=${cod}&weight=${weight}`
  //     );

      

  //     // Check if the response indicates serviceability
  //     if (response && response.status === 200 && response.data.available_courier_companies.length > 0) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     this.logger_.error("Error checking courier serviceability", error);
  //     return false;
  //   }
  // }


  // Implement other required methods as needed
}

export default ShiprocketFulfillmentService;
