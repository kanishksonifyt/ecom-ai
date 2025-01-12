import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { REVIEW_MODULE } from "../modules/review";
import ReviewModuleService from "../modules/review/service";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteLink } from "@medusajs/framework/modules-sdk";
import { Modules } from "@medusajs/framework/utils";

// Create Review
export type CreateReviewStepInput = {
  rating: number;
  title: string;
  description: string;
  user_name: string;
  user_pic?: string;
  date: Date;
  product_id?: string;
};

export const createReviewStep = createStep(
  "create-review-step",
  async (input: CreateReviewStepInput, { container }) => {
    const reviewService: ReviewModuleService = container.resolve(REVIEW_MODULE);

    // console.log("input", input);
    const review = await reviewService.createReviews(input);

    return new StepResponse(review, review.id);
  }
);

export const createReviewWorkflow = createWorkflow(
  "create-review",
  (input: CreateReviewStepInput) => {
    const review = createReviewStep(input);

    return new WorkflowResponse(review);
  }
);

// Get Review by ID
export type GetReviewByIdStepInput = {
  id: string;
};

export const getReviewByIdStep = createStep(
  "get-review-by-id-step",
  async (input: GetReviewByIdStepInput, { container }) => {
    // console.log("review", input.id);
    const reviewService: ReviewModuleService = container.resolve(REVIEW_MODULE);

    const review = await reviewService.retrieveReview(input.id);
    // console.log("review", review);

    return new StepResponse(review, review.id);
  }
);

export const getReviewByIdWorkflow = createWorkflow(
  "get-review-by-id",
  (input: GetReviewByIdStepInput) => {
    const review = getReviewByIdStep(input);

    return new WorkflowResponse(review);
  }
);

// Delete Review
export type DeleteReviewStepInput = {
  id: string;
};

export const deleteReviewStep = createStep(
  "delete-review-step",
  async (input: DeleteReviewStepInput, { container }) => {
    const reviewService: ReviewModuleService = container.resolve(REVIEW_MODULE);

    await reviewService.deleteReviews(input.id);

    return new StepResponse(null, input.id);
  }
);

export const deleteReviewWorkflow = createWorkflow(
  "delete-review",
  (input: DeleteReviewStepInput) => {
    const review = deleteReviewStep(input);

    return new WorkflowResponse(review);
  }
);

// Edit Review
export type EditReviewStepInput = {
  id: string;
  rating?: number;
  title?: string;
  description?: string;
  user_name?: string;
  user_pic?: string;
  date?: Date;
  product_id?: string;
};

export const editReviewStep = createStep(
  "edit-review-step",
  async (input: EditReviewStepInput, { container }) => {
    const reviewService: ReviewModuleService = container.resolve(REVIEW_MODULE);

    const updatedReview = await reviewService.updateReviews({
      id: input.id,
      rating: input.rating,
      title: input.title,
      description: input.description,
      user_name: input.user_name,
      date: input.date,
      user_pic: input.user_pic,
    });

    return new StepResponse(updatedReview, updatedReview.id);
  }
);

export const editReviewWorkflow = createWorkflow(
  "edit-review",
  (input: EditReviewStepInput) => {
    const review = editReviewStep(input);

    return new WorkflowResponse(review);
  }
);

// Get All Reviews
export const getAllReviewsStep = createStep(
  "get-all-reviews-step",
  async (_, { container }) => {
    const reviewService: ReviewModuleService = container.resolve(REVIEW_MODULE);

    const reviews = await reviewService.listReviews();

    return new StepResponse(
      reviews,
      reviews.map((review) => review.id)
    );
  }
);

export const getAllReviewsWorkflow = createWorkflow("get-all-reviews", () => {
  const reviews = getAllReviewsStep();

  return new WorkflowResponse(reviews);
});
