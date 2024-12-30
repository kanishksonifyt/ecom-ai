import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createReviewWorkflow,
  getAllReviewsWorkflow,
  editReviewWorkflow,
  deleteReviewWorkflow,
} from "../../../../workflows/create-review";
import { z } from "zod";
import { PostAdminCreateReview, PatchAdminEditReview } from "../validators";

type PostAdminCreateReviewType = z.infer<typeof PostAdminCreateReview>;

type PatchAdminEditReviewType = z.infer<typeof PatchAdminEditReview>;



  export const PATCH = async (
    req: MedusaRequest<PatchAdminEditReviewType>,
    res: MedusaResponse
  ) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Review id is required" });
    }
    const { body } = req;
  
    // Validate the request body
    const parsedBody = PatchAdminEditReview.parse(body);
  
    // Run the edit workflow
    const updatedReview = await editReviewWorkflow(req.scope).run({
      input: { id, ...parsedBody, date: parsedBody.date ? new Date(parsedBody.date) : undefined },
    });
  
    res.json({ review: updatedReview });
  };
  
  export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params;
  
    await deleteReviewWorkflow(req.scope).run({ input: { id } });
  
    res.status(204).send({
      msg: `${id} was deleted successfully`,
    });
  };
  