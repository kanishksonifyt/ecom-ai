import { Module } from "@medusajs/framework/utils"
import PointsModuleService from "./service"

export const POINT_MODULE = "point"

export default Module(POINT_MODULE, {
  service: PointsModuleService,
})