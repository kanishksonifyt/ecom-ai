import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  console.log("id", id);
  // Check if the review ID is provided
  if (!id) {
    return res.status(400).json({ message: "Review id is required" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {

    if (!id) {
      return res.status(400).json({ message: "Review id is required" });
    }

    // Fetch product details
    const { data: review } = await query.graph({
      entity: "review",
      fields: ["product.review.*", "product.*"],
      filters: {
        id: id,
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ review });
  } catch (error) {
    console.error("Error fetching review or product data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};