import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  getHeroWorkflow,
} from "../../../workflows/create-hero";



export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getHeroWorkflow(req.scope).run();
  result.sort((a, b) => a.index - b.index);
  res.json({ heroes: result });
};
