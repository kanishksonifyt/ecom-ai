import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { HIGHTLIGHT_MODULE } from "../modules/highlights";
import HighlightModuleService from "../modules/highlights/service";
import { link } from "fs";

export type CreateHighlightStepInput = {
  image: string;
  link: string;
  product_id?: string;
};

export const createHighlightStep = createStep(
  "create-highlight-step",
  async (input: CreateHighlightStepInput, { container }) => {
    const HighlightModuleService: HighlightModuleService =
      container.resolve(HIGHTLIGHT_MODULE);

    const Highlight = await HighlightModuleService.createHighlights(input);

    return new StepResponse(Highlight, Highlight.id);
  }
);

type CreateHighlightWorkflowInput = {
  image: string;
  link: string;
};

export const createHighlightWorkflow = createWorkflow(
  "create-highlight",
  (input: CreateHighlightWorkflowInput) => {
    const Highlight = createHighlightStep(input);

    return new WorkflowResponse(Highlight);
  }
);

export const getAllHighlightsStep = createStep(
  "get-all-highlights-step",
  async (_, { container }) => {
    const HighlightModuleService: HighlightModuleService =
      container.resolve(HIGHTLIGHT_MODULE);

    const highlights = await HighlightModuleService.listHighlights();

    return new StepResponse(highlights);
  }
);

export const getAllHighlightsWorkflow = createWorkflow(
  "get-all-highlights",
  () => {
    const highlights = getAllHighlightsStep();

    return new WorkflowResponse(highlights);
  }
);

export type UpdateHighlightStepInput = {
  id: string;
  image?: string;
  link?: string;
  product_id?: string;
};

export const updateHighlightStep = createStep(
  "update-highlight-step",
  async (input: UpdateHighlightStepInput, { container }) => {
    const HighlightModuleService: HighlightModuleService =
      container.resolve(HIGHTLIGHT_MODULE);

    // console.log(input.id);

    const updatedHighlight = await HighlightModuleService.updateHighlights({
      id: input.id,
      image: input.image,
      link: input.link,
      product_id: input.product_id,
    });

    return new StepResponse(updatedHighlight, updatedHighlight.id);
  }
);

type UpdateHighlightWorkflowInput = {
  id: string;
  image?: string;
  link?: string;
  product_id?: string;
};

export const updateHighlightWorkflow = createWorkflow(
  "update-highlight",

  (input: UpdateHighlightWorkflowInput) => {
    const updatedHighlight = updateHighlightStep(input);

    return new WorkflowResponse(updatedHighlight);
  }
);

export type DeleteHighlightStepInput = {
  id: string;
};

export const deleteHighlightStep = createStep(
  "delete-highlight-step",
  async (input: DeleteHighlightStepInput, { container }) => {
    const HighlightModuleService: HighlightModuleService =
      container.resolve(HIGHTLIGHT_MODULE);

    await HighlightModuleService.deleteHighlights(input.id);

    return new StepResponse(null, input.id);
  }
);

type DeleteHighlightWorkflowInput = {
  id: string;
};

export const deleteHighlightWorkflow = createWorkflow(
  "delete-highlight",
  (input: DeleteHighlightWorkflowInput) => {
    const result = deleteHighlightStep(input);

    return new WorkflowResponse(result);
  }
);
