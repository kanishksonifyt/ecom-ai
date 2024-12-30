import { Module } from "@medusajs/framework/utils"
import FeaturedModuleService from "./service"

export const FEATURED_MODULE = "featured"

export default Module(FEATURED_MODULE, {
  service: FeaturedModuleService,
})