import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getAllShowonHomeWorkflow } from "../../../../workflows/create-showonhome";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllShowonHomeWorkflow(req.scope).run();
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  // Fetch list with product details
  const product = await query.graph({
    entity: "product",
    fields: ["*"],
    filters: {
      id: result.map((item) => item.product_id),
    },
  });

  res.json({ showonhome: product });
};
