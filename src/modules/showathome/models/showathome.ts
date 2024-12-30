import { model } from "@medusajs/framework/utils"

export const show_on_homepage = model.define("showonhome", {
  id: model.id().primaryKey(),
  product_id: model.text(),
})