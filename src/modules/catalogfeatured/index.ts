import { Module } from "@medusajs/framework/utils";
import CatalogfeaturedModuleService from "./service";

export const catalogfeatured_MODULE = "catalogfeatured";

export default Module(catalogfeatured_MODULE, {
  service: CatalogfeaturedModuleService,
});
