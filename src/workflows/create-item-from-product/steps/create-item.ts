import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import ItemModelModuleService from "../../../modules/item/service"
import { ITEM_MODULE } from "../../../modules/item"

type CreateItemStepInput = {
    show_on_homepage?: boolean
}

export const createItemStep = createStep(
  "create-item",
  async (data: CreateItemStepInput, { container }) => {
    if (!data.show_on_homepage) {
      return
    }

    const helloModuleService: ItemModelModuleService = container.resolve(
      ITEM_MODULE
    )

    const item = await helloModuleService.createItemModels(data)

    return new StepResponse(item, item)
  },
  async (item, { container }) => {
    const helloModuleService: ItemModelModuleService = container.resolve(
      ITEM_MODULE
    )

    await helloModuleService.deleteItemModels(item.id)
  }
)