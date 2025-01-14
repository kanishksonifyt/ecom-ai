import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createReviewWorkflow,
  getAllReviewsWorkflow,
  deleteReviewWorkflow,
} from "../../../workflows/create-review";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllReviewsWorkflow(req.scope).run();
  res.json({ reviews: result });
};
