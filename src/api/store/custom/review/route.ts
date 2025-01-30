import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createReviewWorkflow,
} from "../../../../workflows/create-review";
import { z } from "zod";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { RemoteLink } from "@medusajs/framework/modules-sdk";
import { REVIEW_MODULE } from "../../../../modules/review";
import { PostAdminCreateReview, PatchAdminEditReview } from "./validators";


type PostAdminCreateReviewType = z.infer<typeof PostAdminCreateReview>;

type PatchAdminEditReviewType = z.infer<typeof PatchAdminEditReview>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateReviewType>,
  res: MedusaResponse
) => {

  const remoteLink: RemoteLink = req.scope.resolve(
    ContainerRegistrationKeys.REMOTE_LINK
  );

  // console.log(req.body);
  const { result } = await createReviewWorkflow(req.scope).run({
    input: {
      ...req.body,
      description: req.body.description ?? "",
      date: new Date(req.body.date),
    },
  });


  if (req.body.product_id) {
    await remoteLink.create({
      [Modules.PRODUCT]: {
        product_id: req.body.product_id,
      },
      [REVIEW_MODULE]: {
        review_id: result.id,
      },
    });
  }

  res.json({ review: result });
};
