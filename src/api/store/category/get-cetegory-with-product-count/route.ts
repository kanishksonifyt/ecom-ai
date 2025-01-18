import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Initialize the Product Module
    const productModule = req.scope.resolve(Modules.PRODUCT);

    // Retrieve categories with their associated products
    const [categories, count] = await productModule.listAndCountProductCategories({}, {
      relations: ["products"]
    });

    // Map categories to include product counts
    const categoriesWithProductCounts = categories.map(category => ({
      id: category.id,
      name: category.name,
      product_count: category.products.length
    }));

    // Send the response
    res.json({ categories: categoriesWithProductCounts });
  } catch (error) {
    console.error("Error in GET handler:", error);
    res.status(500).json({ error: "Failed to retrieve product categories" });
  }
};
