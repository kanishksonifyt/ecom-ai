import { model } from "@medusajs/framework/utils";

export const Highlight = model.define("highlight", {
  id: model.id().primaryKey(),
  image: model.text(),
  link: model.text(),
  product_id : model.text().nullable(),
});
