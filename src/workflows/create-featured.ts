import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { FEATURED_MODULE } from "../modules/featured";
import FeaturedModuleService from "../modules/featured/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// Create Featured
export type CreateFeaturedStepInput = {
  image: string;
  link: string;
  title: string;
  text: string;
};

export const createFeaturedStep = createStep(
  "create-featured-step",
  async (input: CreateFeaturedStepInput, { container }) => {
    const featuredService: FeaturedModuleService =
      container.resolve(FEATURED_MODULE);

    // console.log("input", input);
    const featured = await featuredService.createFeatureds(input);

    return new StepResponse(featured, featured.id);
  }
);

export const createFeaturedWorkflow = createWorkflow(
  "create-featured",
  (input: CreateFeaturedStepInput) => {
    const featured = createFeaturedStep(input);

    return new WorkflowResponse(featured);
  }
);

// Get Featured by ID
export type GetFeaturedByIdStepInput = {
  id: string;
};

export const getFeaturedByIdStep = createStep(
  "get-featured-by-id-step",
  async (input: GetFeaturedByIdStepInput, { container }) => {
    const featuredService: FeaturedModuleService =
      container.resolve(FEATURED_MODULE);

    const featured = await featuredService.listFeatureds(input.id);

    return new StepResponse(featured, featured[0].id);
  }
);

export const getFeaturedByIdWorkflow = createWorkflow(
  "get-featured-by-id",
  (input: GetFeaturedByIdStepInput) => {
    const featured = getFeaturedByIdStep(input);

    return new WorkflowResponse(featured);
  }
);

// Delete Featured
export type DeleteFeaturedStepInput = {
  id: string;
};

export const deleteFeaturedStep = createStep(
  "delete-featured-step",
  async (input: DeleteFeaturedStepInput, { container }) => {
    const featuredService: FeaturedModuleService =
      container.resolve(FEATURED_MODULE);

    await featuredService.deleteFeatureds(input.id);

    return new StepResponse(null, input.id);
  }
);

export const deleteFeaturedWorkflow = createWorkflow(
  "delete-featured",
  (input: DeleteFeaturedStepInput) => {
    const featured = deleteFeaturedStep(input);

    return new WorkflowResponse(featured);
  }
);

// Edit Featured
export type EditFeaturedStepInput = {
  id: string;
  image?: string;
  title?: string;
  text?: string;
  link?: string;
  type?:string;
};

export const editFeaturedStep = createStep(
  "edit-featured-step",
  async (input: EditFeaturedStepInput, { container }) => {
    const featuredService: FeaturedModuleService =
      container.resolve(FEATURED_MODULE);

      console.log(input ,"this from workflwo")

    const updatedFeatured = await featuredService.updateFeatureds({
      id: input.id,
      image: input.image,
      link: input.link,
      type : input.type,
      text: input.text,
      title: input.title,
    });

    return new StepResponse(updatedFeatured, updatedFeatured.id);
  }
);

export const editFeaturedWorkflow = createWorkflow(
  "edit-featured",
  (input: EditFeaturedStepInput) => {
    const featured = editFeaturedStep(input);

    return new WorkflowResponse(featured);
  }
);

// Get All Featureds
export const getAllFeaturedsStep = createStep(
  "get-all-featureds-step",
  async (_, { container }) => {
    const featuredService: FeaturedModuleService =
      container.resolve(FEATURED_MODULE);

    const featureds = await featuredService.listFeatureds();

    return new StepResponse(
      featureds,
      featureds.map((featured) => featured.id)
    );
  }
);

export const getAllFeaturedsWorkflow = createWorkflow(
  "get-all-featureds",
  () => {
    const featureds = getAllFeaturedsStep();

    return new WorkflowResponse(featureds);
  }
);
