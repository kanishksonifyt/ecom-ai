import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  getHomeWorkflow,
} from "../../../workflows/create-home";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getHomeWorkflow(req.scope).run();
  result.sort((a, b) => a.index - b.index);
  res.json({ home : result });
};
