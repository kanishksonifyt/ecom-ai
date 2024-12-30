import { MedusaService } from "@medusajs/framework/utils"
import { Homepage } from "./models/homepage"

class HomepageModuleService extends MedusaService({
  Homepage,
}) {

}

export default HomepageModuleService