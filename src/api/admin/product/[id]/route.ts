// getProductByIdWorkflow

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getProductByIdWorkflow } from "../../../../workflows/create-product";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  // console.log("route hit", id);
  // Run the get workflow
  const home = await getProductByIdWorkflow(req.scope).run({ input: { id } });

  // Send the hero data in the response
  res.json({ home });
};
