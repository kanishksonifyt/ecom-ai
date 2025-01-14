import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  getAllHighlightsWorkflow,
} from "../../../workflows/create-Highlight";



export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllHighlightsWorkflow(req.scope).run();
  res.json({ highlights: result });
};
