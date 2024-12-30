import { MedusaService } from "@medusajs/framework/utils"
import { Featured } from "./models/featured"

class FeaturedModuleService extends MedusaService({
  Featured,
}) {

}

export default FeaturedModuleService