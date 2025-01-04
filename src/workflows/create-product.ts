import { 
    createWorkflow, 
    WorkflowResponse,
    createStep,
    StepResponse,
  } from "@medusajs/framework/workflows-sdk"
  import { Modules } from "@medusajs/framework/utils"
  
  const createProductStep = createStep(
    "create-product",
    async ({}, { container }) => {
      const productService = container.resolve(Modules.PRODUCT)
  
      const product = await productService.createProducts({
        title: "Medusa Shirt",
        options: [
          {
            title: "Color",
            values: ["Black", "White"],
          },
        ],
        variants: [
          {
            title: "Black Shirt",
            options: {
              Color: "Black",
            },
          },
        ],
      })
  
      return new StepResponse({ product }, product.id)
    },
    async (productId, { container }) => {
      if (!productId) {
        return
      }
      const productService = container.resolve(Modules.PRODUCT)
  
      await productService.deleteProducts([productId])
    }
  )
  
  export const createProductWorkflow = createWorkflow(
    "create-product",
    () => {
      const { product } = createProductStep()
  
      return new WorkflowResponse({
        product,
      })
    }
  )


const getAllProductsStep = createStep(
    "get-all-products",
    async ({}, { container }) => {
        const productService = container.resolve(Modules.PRODUCT)
        const products = await productService.listProducts()
        return new StepResponse({ products })
    }
)

export const getAllProductsWorkflow = createWorkflow(
    "get-all-products",
    () => {
        const { products } = getAllProductsStep()
        return new WorkflowResponse({
            products,
        })
    }
)

type GetProductByIdWorkflowInput = {
  id: string
}

const getProductByIdStep = createStep(
  "get-product-by-id",
  async ( input: GetProductByIdWorkflowInput , { container }) => {
    const productService = container.resolve(Modules.PRODUCT)
    const product = await productService.retrieveProduct(input.id)
    return new StepResponse({ product })
  }
)




export const getProductByIdWorkflow = createWorkflow(
  "get-product-by-id",
  (input: GetProductByIdWorkflowInput) => {
    const { product } = getProductByIdStep(input)
    return new WorkflowResponse({
      product,
    })
  }
)