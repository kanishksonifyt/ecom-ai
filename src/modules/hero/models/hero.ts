import { model } from "@medusajs/framework/utils";

export const Hero = model.define("hero", {
  id: model.id().primaryKey(),
  index : model.number(),
  title: model.text(),
  subtitle: model.text(),
  firsttext: model.text(),
  secondtext: model.text(),
  firstbuttonroute : model.text().nullable(),
  secoundbuttonroute : model.text().nullable(),
  image: model.text(),
});
