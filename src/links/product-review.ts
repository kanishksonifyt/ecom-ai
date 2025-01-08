import { defineLink } from "@medusajs/framework/utils";
import ITEM_MODULE from "../modules/review";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(
  ProductModule.linkable.product,

  ITEM_MODULE.linkable.review
);