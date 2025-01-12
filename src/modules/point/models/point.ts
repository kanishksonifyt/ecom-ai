import { model } from "@medusajs/framework/utils"

export const Point = model.define("point", {
  id: model.id().primaryKey(),
  coins: model.number(),
  relatedto : model.text(),
  owner_id : model.text().searchable(),
})