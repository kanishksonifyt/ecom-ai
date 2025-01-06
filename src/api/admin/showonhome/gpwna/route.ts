import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getAllShowonHomeWorkflow } from "../../../../workflows/create-showonhome";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllShowonHomeWorkflow(req.scope).run();
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  
  // Fetch list with product details
  const productIdsInResult = result.map((item) => item.product_id);

  const product = await query.graph({
    entity: "product",
    fields: ["*"],
  });

  const excludedProducts = product.data.filter(
    (product) => !productIdsInResult.includes(product.id)
  );

  res.json({ showonhome: excludedProducts });
};
