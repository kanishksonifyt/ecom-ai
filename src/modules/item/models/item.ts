import { model } from "@medusajs/framework/utils";


export const ItemModel = model.define("item", {
    id: model.id().primaryKey(),
    show_on_homepage: model.boolean(),
});