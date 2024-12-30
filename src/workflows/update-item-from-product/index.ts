import { ProductDTO } from "@medusajs/framework/types"
import { createWorkflow, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep, dismissRemoteLinkStep, useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { ITEM_MODULE } from "../../modules/item"
import { deleteItemModelStep  } from "./steps/delete-item"
import { createItemStep } from "../create-item-from-product/steps/create-item"
import { updateItemStep } from "./steps/update-item"

export type UpdateItemFromProductStepInput = {
  product: ProductDTO
  additional_data?: {
    show_on_homepage ?: boolean | null
  }
}




export const updateCustomFromProductWorkflow = createWorkflow(
    "update-item-from-product",
    (input: UpdateItemFromProductStepInput) => {
      const { data: products } = useQueryGraphStep({
        entity: "product",
        fields: ["item.*"],
        filters: {
          id: input.product.id,
        },
        options: {
            throwIfKeyNotFound: true
          }
      })
  
      // TODO create, update, or delete Custom record
     
        const created = when(
            "create-product-item-link",
            {
              input,
              products,
            }, (data) => 
              !data.products[0].item
          )
          .then(() => {
            const item = createItemStep({
              show_on_homepage: input.additional_data?.show_on_homepage ?? undefined,
            })
          
            createRemoteLinkStep([{
              [Modules.PRODUCT]: {
                product_id: input.product.id,
              },
              [ITEM_MODULE]: {
                item_id: item.id,
              },
            }])
          
            return item
          })

          const deleted = when(
            "delete-product-item-link",
            {
              input,
              products,
            }, (data) => 
              data.products[0].item !== null
          )
          .then(() => {
            deleteItemModelStep({
              item: {
                id: products[0].item!.id,
                show_on_homepage: products[0].item!.show_on_homepage,
                created_at: new Date(products[0].item!.created_at),
                updated_at: new Date(products[0].item!.updated_at),
                deleted_at: products[0].item!.deleted_at ? new Date(products[0].item!.deleted_at) : null,
              },
            })
          
            dismissRemoteLinkStep({
              [ITEM_MODULE]: {
                item_id: products[0].item?.id ?? "",
              },
            })
          
            return products[0].item?.id ?? ""
          })
          
          // TODO delete Custom record

          const updated = when({
            input,
            products,
          }, (data) => data.products[0].item !== null)
          .then(() => {
            return updateItemStep({
              id: products[0].item?.id ?? "",
              show_on_homepage: input.additional_data?.show_on_homepage ?? false,
            })
          })
          
          return new WorkflowResponse({
            created,
            updated,
            deleted,
          })
          
    }
  )
