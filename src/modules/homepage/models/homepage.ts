import { model } from "@medusajs/framework/utils";

export const Homepage = model.define("homepage", {
  id: model.id().primaryKey(),
  index: model.number(),
  route: model.text(),
  title: model.text(),
  redirect: model.text().nullable(),
  text : model.text().nullable(),
});
