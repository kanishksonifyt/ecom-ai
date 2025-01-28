import axios, { AxiosInstance } from "axios";

 
interface ShiprocketConfig {
  email: string;
  password: string;
  baseUrl?: string;
}
 
interface AuthResponse {
  token: string;
}
 
interface OrderData {
  // Define the structure based on Shiprocket's API requirements
  order_id?: number;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
  }>;
  shipping_customer_name: string;
  shipping_customer_phone: string;
  shipping_customer_address: string;
  shipping_customer_city: string;
  shipping_customer_state: string;
  shipping_customer_pincode: string;
  order_date: string;
  // Add other required fields here
}
 
class ShiprocketClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private config: ShiprocketConfig;
 
  constructor(config: ShiprocketConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl || "https://apiv2.shiprocket.in/v1/external",
    });
  }
 
  public async authenticate(): Promise<void> {
    try {
      const response = await this.client.post<AuthResponse>("/auth/login", {
        email: this.config.email,
        password: this.config.password,
      });
      this.token = response.data.token;
      this.client.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    } catch (error) {
      throw new Error("Failed to authenticate with Shiprocket API: " + error.message);
    }
  }
 
  public async ensureAuthenticated(): Promise<void> {
    if (!this.token) {
      await this.authenticate();
    }
  }
 
  public async createOrder(orderData: OrderData): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.client.post("/orders/create/adhoc", orderData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create order: " + error.message);
    }
  }
 
  public async cancelOrder(orderId: number): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.client.post("/orders/cancel", { order_id: orderId });
      return response.data;
    } catch (error) {
      throw new Error("Failed to cancel order: " + error.message);
    }
  }
 
  public async trackShipment(shipmentId: number): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.client.get(`/shipments/${shipmentId}/track`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to track shipment: " + error.message);
    }
  }
 
  public async generateLabel(shipmentId: number): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.client.get(`/shipments/${shipmentId}/label`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to generate label: " + error.message);
    }
  }
 
  public async generateInvoice(orderId: number): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.client.get(`/orders/${orderId}/invoice`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to generate invoice: " + error.message);
    }
  }
 
  public async fetchCourierPartners(): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.client.get("/courier/serviceability");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch courier partners: " + error.message);
    }
  }
 
  public async estimateShippingCost(data: {
    pickup_postcode: string;
    delivery_postcode: string;
    weight: number; // in kg
    cod: number; // 1 for COD, 0 for Prepaid
  }): Promise<any> {
    await this.ensureAuthenticated();
    try {
      const response = await this.client.post("/courier/serviceability/", data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to estimate shipping cost: " + error.message);
    }
  }
}
 
export default ShiprocketClient;