import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ItemModel } from "../../../modules/item/models/item"
import { InferTypeOf } from "@medusajs/framework/types"
import ItemModelModuleService from "../../../modules/item/service"
import { ITEM_MODULE } from "../../../modules/item"

type DeleteItemModelStepInput = {
  item: InferTypeOf<typeof ItemModel>
}

export const deleteItemModelStep = createStep(
  "delete-item",
  async ({ item }: DeleteItemModelStepInput, { container }) => {
    const ItemModelModuleService: ItemModelModuleService = container.resolve(
      ITEM_MODULE
    )

    await ItemModelModuleService.deleteItemModels(item.id)

    return new StepResponse(item, item)
  },
  async (item, { container }) => {
    const ItemModelModuleService: ItemModelModuleService = container.resolve(
      ITEM_MODULE
    )

    await ItemModelModuleService.createItemModels(item)
  }
)