import { Module } from "@medusajs/framework/utils";
import ItemModelModuleService from "./service";

export const ITEM_MODULE = "item";

export default Module(ITEM_MODULE, {
  service: ItemModelModuleService,
  // You can add other properties such as repositories, controllers, etc.
});
