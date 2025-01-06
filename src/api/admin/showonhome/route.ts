// getAllShowonHomeWorkflow

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getAllShowonHomeWorkflow } from "../../../workflows/create-showonhome";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllShowonHomeWorkflow(req.scope).run();

  // Fetch product details
  // const { data: product } = await query.graph({
  //   entity: "review",
  //   fields: ["product.review.*", "product.*"],
  //   filters: {
  //     id: id,
  //   },
  // });
  res.json({ showonhome: result });
};
