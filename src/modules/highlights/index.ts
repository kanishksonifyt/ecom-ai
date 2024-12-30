import { Module } from "@medusajs/framework/utils"
import HighlightModuleService from "./service"

export const HIGHTLIGHT_MODULE = "hightlight"

export default Module(HIGHTLIGHT_MODULE, {
  service: HighlightModuleService,
})