import { MedusaService } from "@medusajs/framework/utils"
import { Point } from "./models/point"

class PointsModuleService extends MedusaService({
  Point,
}) {

}

export default PointsModuleService