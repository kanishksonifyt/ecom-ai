import { model } from "@medusajs/framework/utils";

export const Catalog = model.define("catalog", {
  id: model.id().primaryKey(),
  image: model.text(),
  link: model.text(),
});