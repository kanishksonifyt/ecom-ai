import { model } from "@medusajs/framework/utils";

export const catalogfeatured = model.define("catalogfeatured", {
  id: model.id().primaryKey(),
  image: model.text(),
  link: model.text(),
});
