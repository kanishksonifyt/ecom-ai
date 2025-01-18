import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getReviewsByProductIdWorkflow } from "../../../../../workflows/create-review";


const calculateAverageRating = (reviews: { rating: number }[]): number => {
  // Ensure there are reviews before attempting to calculate the average
  if (reviews.length === 0) return 0;

  // Sum up all the ratings
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

  // Calculate and return the average
  return totalRating / reviews.length;
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  // Get reviews based on product_id
  const { result: review } = await getReviewsByProductIdWorkflow(req.scope).run(
    {
      input: { product_id: id },
    }
  );

  // Use container to resolve the PRODUCT module
  const productService = req.scope.resolve(Modules.PRODUCT);

  // Fetch the product details with related categories
  const category = await productService.retrieveProduct(id, {
    relations: ["categories"],
  });

  const averageRating = calculateAverageRating(review);         

  // Construct the final result object with everything under `productDetails`
  const finalResult = {
    reviews: review,
    categories: category.categories, // Include categories for the product
    averageRating,
  };

  // Calculate the average rating for the product
  // Return the response
  res.json({
    productsubdetails: finalResult,
  });
};
