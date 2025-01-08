import axios, { AxiosInstance } from "axios";
import { Logger, ConfigModule } from "@medusajs/framework/types";

export type ModuleOptions = {
  apiUrl: "https://knaishk.erpnext.com/"; // Base URL of your ERPNext instance
  apiKey: "b603e3d27b25314";
  apiSecret: "1bfb2d27f644041";
};

type InjectedDependencies = {
  logger: Logger;
  configModule: ConfigModule;
};

class CmsModuleService {
  private options_: ModuleOptions;
  private logger_: Logger;
  private httpClient_: AxiosInstance;

  constructor(
    { logger }: InjectedDependencies,
    options: ModuleOptions
  ) {
    this.logger_ = logger;
    this.options_ = options;

    // Initialize Axios instance with base URL and authentication headers
    this.httpClient_ = axios.create({
      baseURL: this.options_.apiUrl,
      headers: {
        Authorization: `token ${this.options_.apiKey}:1bfb2d27f644041`,
        "Content-Type": "application/json",
      },
    });
  }

  // Method to create a sales order in ERPNext
  async createSalesOrder(salesOrder: Record<string, unknown>) {
    try {
      const response = await this.httpClient_.post(
        "https://knaishk.erpnext.com/api/resource/sales",
        salesOrder
      );
      this.logger_.info(
        `Sales Order created with ID: ${response.data.data.name}`
      );
      return response.data.data;
    } catch (error) {
      this.logger_.error(
        `Error creating Sales Order: ${error.response?.data?.message || error.message}`
      );
      throw error;
    }
  }

  // Method to delete a sales order in ERPNext
  async deleteSalesOrder(id: string) {
    try {
      await this.httpClient_.delete(`/api/resource/Sales Order/${id}`);
      this.logger_.info(`Sales Order with ID: ${id} deleted successfully.`);
    } catch (error) {
      this.logger_.error(
        `Error deleting Sales Order: ${error.response?.data?.message || error.message}`
      );
      throw error;
    }
  }

  // Method to retrieve all sales orders from ERPNext
  async retrieveSalesOrders(): Promise<Record<string, unknown>[]> {
    try {
      const response = await this.httpClient_.get("/api/resource/Sales Order");
      this.logger_.info(`Retrieved ${response.data.data.length} Sales Orders.`);
      return response.data.data;
    } catch (error) {
      this.logger_.error(
        `Error retrieving Sales Orders: ${error.response?.data?.message || error.message}`
      );
      throw error;
    }
  }
}

export default CmsModuleService;
