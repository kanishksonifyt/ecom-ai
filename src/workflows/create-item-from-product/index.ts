import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { ProductDTO } from "@medusajs/framework/types"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { createItemStep } from "./steps/create-item"
import ItemModelModuleService from "../../modules/item/service"
import { ITEM_MODULE } from "../../modules/item"

export type CreateCustomFromProductWorkflowInput = {
  product: ProductDTO
  additional_data?: {
    show_on_homepage?: boolean
  }
}

export const createCustomFromProductWorkflow = createWorkflow(
  "create-item-from-product",
  (input: CreateCustomFromProductWorkflowInput) => {
    const itemName = transform(
      {
        input,
      },
      (data) => !!data.input.additional_data?.show_on_homepage
    )

    const item = createItemStep({
      show_on_homepage: itemName,
    })

    when(({ item }), ({ item }) => item !== undefined)
      .then(() => {
        createRemoteLinkStep([{
          [Modules.PRODUCT]: {
            product_id: input.product.id,
          },
          [ITEM_MODULE]: {
            item_id: item.id,
          },
        }])
      })

    return new WorkflowResponse({
      item,
    })
  }
)