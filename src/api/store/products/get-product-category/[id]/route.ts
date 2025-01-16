import { Modules } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req : MedusaRequest, res : MedusaResponse ) => {
  try {
    const { id: productId } = req.params;

    console.log("Route hit with product ID:", productId);

    // Use container to resolve the PRODUCT module
    const productService = req.scope.resolve(Modules.PRODUCT);

    // Retrieve the product along with its categories
    const product = await productService.retrieveProduct(productId, {
      relations: ["categories"],
    });

    // Extract categories
    const categories = product.categories;

    // Send categories in response
    res.json({ categories });
  } catch (error) {
    console.error("Error in GET handler:", error);
    res.status(500).json({ error: "Failed to retrieve product categories" });
  }
};
