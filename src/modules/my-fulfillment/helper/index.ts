import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { Logger } from "@medusajs/medusa/types";

interface ShiprocketConfig {
  email: string;
  password: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  channel_id?: string;
}

interface AuthResponse {
  token: string;
  expires_in?: number;
}

interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: string;
}

interface Address {
  customer_name: string;
  customer_phone: string;
  address: string;
  address_2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  email?: string;
}

interface OrderData {
  order_id?: string | number;
  order_date: string;
  pickup_location?: string;
  channel_id?: string;
  comment?: string;
  order_items: OrderItem[];
  shipping_is_billing?: boolean;
  billing_address: Address;
  shipping_address: Address;
  payment_method: "COD" | "Prepaid";
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
}

interface ShippingEstimateParams {
  pickup_postcode: string;
  delivery_postcode: string;
  weight: number;
  cod: boolean;
  delivery_mode?: "Surface" | "Express";
  order_items?: OrderItem[];
}

interface ServiceabilityResponse {
  available_courier_companies: Array<{
    id: number;
    name: string;
    rating: number;
    etd: string;
    charge: number;
  }>;
}

interface TrackingResponse {
  tracking_data: {
    shipment_status: string;
    shipment_track: Array<{
      date: string;
      status: string;
      location: string;
      activity: string;
    }>;
    
    default: {};
  };
}

class ShiprocketAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ShiprocketAPIError';
  }
}

class ShiprocketClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private config: Required<ShiprocketConfig>;
  private requestQueue: Promise<any> = Promise.resolve();
  private logger = console;

  constructor(config: ShiprocketConfig) {
    this.config = {
      email: config.email,
      password: config.password,
      baseUrl: config.baseUrl || "https://apiv2.shiprocket.in/v1/external",
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      channel_id : config.channel_id || "123456",
      retryDelay: config.retryDelay || 1000,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
    });

    this.setupResponseInterceptor();
  }

  private setupResponseInterceptor(): void {
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.token = null;
          this.tokenExpiry = null;
          
          // Retry the original request with new token
          try {
            await this.authenticate();
            const originalRequest = error.config;
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${this.token}`;
              return this.client(originalRequest);
            }
          } catch (authError) {
            throw new ShiprocketAPIError(
              "Authentication failed during retry",
              401,
              authError
            );
          }
        }
        
        throw new ShiprocketAPIError(
          error.message,
          error.response?.status,
          error.response?.data
        );
      }
    );
  }

  private async retryOperation<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt === this.config.retryAttempts) break;
        
        await new Promise(resolve => 
          setTimeout(resolve, this.config.retryDelay * Math.pow(2, attempt - 1))
        );
      }
    }
    
    throw lastError;
  }

  private async makeRequest<T>(
    config: AxiosRequestConfig
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue = this.requestQueue.then(async () => {
        try {
          await this.ensureAuthenticated();
          const response = await this.retryOperation(
            () => this.client.request<T>({
              ...config,
              headers: {
                ...config.headers,
                Authorization: `Bearer ${this.token}`,
              },
            })
          );
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async authenticate(): Promise<string> {
    try {
      const response = await this.client.post<AuthResponse>("/auth/login", {
        email: this.config.email,
        password: this.config.password,
        
      });

      this.logger.info(`Authenticated with Shiprocket API : ${JSON.stringify(response.data)}`);

      this.token = response.data.token;
      this.tokenExpiry = response.data.expires_in 
        ? Date.now() + (response.data.expires_in * 1000)
        : Date.now() + (10); // Default 1 second expiry

      this.client.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      return response.data.token;
    } catch (error) {
      throw new ShiprocketAPIError(
        "Authentication failed",
        (error as AxiosError).response?.status,
        (error as AxiosError).response?.data
      );
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.token || (this.tokenExpiry && Date.now() >= this.tokenExpiry)) {
      await this.authenticate();
    }
  }

  public async createOrder(orderData: OrderData): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      url: '/orders/create/adhoc',
      data: orderData,
    });
  }

  public async cancelOrder(orderId: string | number, reason?: string): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      url: '/orders/cancel',
      data: { 
        order_id: orderId,
        cancellation_reason: reason || 'Cancelled by customer'
      },
    });
  }

  public async trackShipment(shipmentId: string | number): Promise<TrackingResponse> {
    return this.makeRequest({
      method: 'GET',
      url: `/shipments/${shipmentId}/track`,
    });
  }

  public async generateLabel(shipmentId: string | number): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      url: `/courier/generate/label/${shipmentId}`,
    });
  }

  public async generateInvoice(orderId: string | number): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      url: `/orders/print/invoice/${orderId}`,
    });
  }

  public async fetchCourierPartners(pickupPostcode: string, deliveryPostcode: string): Promise<any> {
    return this.makeRequest({
      method: 'GET',
      url: '/courier/serviceability',
      params: {
        pickup_postcode: pickupPostcode,
        delivery_postcode: deliveryPostcode,
      },
    });
  }

  public async estimateShippingCost(
    params: ShippingEstimateParams
  ): Promise<ServiceabilityResponse> {
    return this.makeRequest({
      method: 'GET',
      url: '/courier/serviceability',
      params: {
        pickup_postcode: params.pickup_postcode,
        delivery_postcode: params.delivery_postcode,
        weight: params.weight,
        cod: params.cod ? 1 : 0,
        mode: params.delivery_mode || 'Surface',
      },
    });
  }

  public async getPickupLocations(): Promise<any> {
    return this.makeRequest({
      method: 'GET',
      url: '/settings/company/pickup',
    });
  }

  public async generateManifest(shipmentIds: number[]): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      url: '/manifests/generate',
      data: {
        shipment_id: shipmentIds,
      },
    });
  }

  public async requestPickup(shipmentId: number): Promise<any> {
    return this.makeRequest({
      method: 'POST',
      url: '/courier/generate/pickup',
      data: {
        shipment_id: shipmentId,
      },
    });
  }
}

export default ShiprocketClient;
export type {
  ShiprocketConfig,
  OrderData,
  OrderItem,
  Address,
  ShippingEstimateParams,
  ServiceabilityResponse,
  TrackingResponse,
};