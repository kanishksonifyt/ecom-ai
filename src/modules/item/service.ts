import { MedusaService } from "@medusajs/framework/utils"
import { ItemModel } from "./models/item"

class ItemModelModuleService extends MedusaService({
  ItemModel,
}) {

}

export default ItemModelModuleService