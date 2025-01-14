import { getHomeByIdWorkflow } from "../../../../workflows/create-home";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  console.log("route hit", id);
  // Run the get workflow
  const home = await getHomeByIdWorkflow(req.scope).run({ input: { id } });

  // Send the hero data in the response
  res.json({ home });
};
