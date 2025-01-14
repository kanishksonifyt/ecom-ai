import { model } from "@medusajs/framework/utils";

export const Highlight = model.define("highlight", {
  id: model.id().primaryKey(),
  image: model.text().nullable(),
  link: model.text().nullable(),
  product_id : model.text().nullable(),
  type : model.text().nullable(),
});

