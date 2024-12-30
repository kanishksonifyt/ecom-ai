import { MedusaService } from "@medusajs/framework/utils"
import { show_on_homepage } from "./models/showathome"

class ShowonhomepageModuleService extends MedusaService({
  show_on_homepage,
}) {

}

export default ShowonhomepageModuleService;