import { MedusaService } from "@medusajs/framework/utils"
import { Hero } from "./models/hero"

class HeroModuleService extends MedusaService({
    Hero,
}) {

}

export default HeroModuleService;