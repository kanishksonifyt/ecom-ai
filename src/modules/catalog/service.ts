
import { MedusaService } from "@medusajs/framework/utils";
import { Catalog } from "./models/catalog";

class CatalogModuleService extends MedusaService({ Catalog }) {
  // Additional custom methods can be added here if required
}

export default CatalogModuleService;
