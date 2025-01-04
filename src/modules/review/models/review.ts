import { model } from "@medusajs/framework/utils";

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  rating: model.float(),
  title: model.text(),
  description: model.text(),
  user_name: model.text(),
  date : model.dateTime(),
  user_pic : model.text().nullable(),
  product_id : model.text().nullable(),
});
