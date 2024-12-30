import { Module } from "@medusajs/framework/utils"
import ShowonhomepageModuleService from "./service"

export const SHOWONHOME_MODULE = "showonhome"

export default Module(SHOWONHOME_MODULE, {
  service: ShowonhomepageModuleService,
})