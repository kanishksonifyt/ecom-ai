import { defineLink } from "@medusajs/framework/utils"
import ITEM_MODULE from "../modules/item"
import ProductModule from "@medusajs/medusa/product"

export default defineLink(
  ProductModule.linkable.product,
  ITEM_MODULE.linkable.item
)