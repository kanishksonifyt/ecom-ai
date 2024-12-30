import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createReviewWorkflow,
  getAllReviewsWorkflow,
  deleteReviewWorkflow,
} from "../../../workflows/create-review";
import { z } from "zod";
import { PostAdminCreateReview, PatchAdminEditReview } from "./validators";

type PostAdminCreateReviewType = z.infer<typeof PostAdminCreateReview>;

type PatchAdminEditReviewType = z.infer<typeof PatchAdminEditReview>;



export const POST = async (
    req: MedusaRequest<PostAdminCreateReviewType>,
    res: MedusaResponse
  ) => {
    const { result } = await createReviewWorkflow(req.scope).run({
      input: { 
        ...req.body, 
        description: req.body.description ?? "", 
        date: new Date(req.body.date) 
      },
    });
  
    res.json({ review: result });
  };
  
  export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { result } = await getAllReviewsWorkflow(req.scope).run();
    res.json({ reviews: result });
  };
  