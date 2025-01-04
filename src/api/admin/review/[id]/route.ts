import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createReviewWorkflow,
  getAllReviewsWorkflow,
  editReviewWorkflow,
  getReviewByIdWorkflow,
  deleteReviewWorkflow,
} from "../../../../workflows/create-review";
import { z } from "zod";
import { PostAdminCreateReview, PatchAdminEditReview } from "../validators";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Modules } from "@medusajs/framework/utils";
import { REVIEW_MODULE } from "../../../../modules/review";
import { RemoteLink } from "@medusajs/framework/modules-sdk";

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
    input: {
      id,
      ...parsedBody,
      date: parsedBody.date ? new Date(parsedBody.date) : undefined,
    },
  });

  res.json({ review: updatedReview });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const remoteLink: RemoteLink = req.scope.resolve(
    ContainerRegistrationKeys.REMOTE_LINK
  );

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: product_id } = await query.graph({
    entity: "review",
    fields: ["product.id"],
    filters: {
      id: id,
    },
  });

  try {
    try {
      if(product_id){
        console.log("product_id", product_id[0].product.id);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }

    console.log("id", id);
    if(product_id){
      await remoteLink.dismiss({
        [Modules.PRODUCT]: {
          product_id: product_id[0].product.id,
        },
        [REVIEW_MODULE]: {
          review_id: id,
        },
      });
    }

    await deleteReviewWorkflow(req.scope).run({ input: { id } });

    res.status(204).send({
      msg: `${id} was deleted successfully`,
    });
  } catch (error) {
    console.error("Error fetching review or product data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  console.log("id", id);
  // Check if the review ID is provided
  if (!id) {
    return res.status(400).json({ message: "Review id is required" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    // Fetch review details
    const review = await getReviewByIdWorkflow(req.scope).run({
      input: { id },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ review });
  } catch (error) {
    console.error("Error fetching review or product data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};
