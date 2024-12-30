import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ITEM_MODULE } from "../../../modules/item"
import ItemModelModuleService from "../../../modules/item/service"

type UpdateCustomStepInput = {
  id: string
  show_on_homepage: boolean
}

export const updateItemStep = createStep(
  "update-item",
  async ({ id, show_on_homepage }: UpdateCustomStepInput, { container }) => {
    const ItemModelModuleService: ItemModelModuleService = container.resolve(
      ITEM_MODULE
    )

    const prevData = await ItemModelModuleService.retrieveItemModel(id)

    const item = await ItemModelModuleService.updateItemModels({
      id,
      show_on_homepage,
    })

    return new StepResponse(item, prevData)
  },
  async (prevData, { container }) => {
    const ItemModelModuleService: ItemModelModuleService = container.resolve(
      ITEM_MODULE
    )

    await ItemModelModuleService.updateItemModels(prevData)
  }
)