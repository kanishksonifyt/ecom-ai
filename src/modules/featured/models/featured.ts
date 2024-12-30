import { model } from "@medusajs/framework/utils";

export const Featured = model.define("featured", {
  id: model.id().primaryKey(),
  title: model.text(),
  link: model.text(),
  image: model.text(),
  text: model.text(),
  
});
