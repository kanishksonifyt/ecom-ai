import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { catalogfeatured_MODULE } from "../modules/catalogfeatured";
import cataloChightlighthightlightModuleService from "../modules/catalogfeatured/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// Create cataloChightlight
export type CreatecatalogfeaturedStepInput = {
  image: string;
  link: string;
};

export const createcatalogfeaturedStep = createStep(
  "create-catalogfeatured-step",
  async (input: CreatecatalogfeaturedStepInput, { container }) => {
    console.log("hi");
    if (!input.image || !input.link) {
      throw new Error("Missing required fields: image and link");
    }

    // Log the input to check if it's coming as expected
    console.log("Input received for catalog highlight:", input);

    const catalogService: cataloChightlighthightlightModuleService =
      container.resolve(catalogfeatured_MODULE);

    const catalogfeatured = await catalogService.createCatalogfeatureds({
      image: input.image,
      link: input.link,
    });

    return new StepResponse(catalogfeatured, catalogfeatured.id);
  }
);

export const createcatalogfeaturedWorkflow = createWorkflow(
  "create-catalogfeatured",
  (input: CreatecatalogfeaturedStepInput) => {
    const catalogfeatured = createcatalogfeaturedStep(input);

    return new WorkflowResponse(catalogfeatured);
  }
);

// Get cataloChightlight by ID
export type GetcatalogfeaturedByIdStepInput = {
  id: string;
};

export const getcatalogfeaturedByIdStep = createStep(
  "get-catalogfeatured-by-id-step",
  async (input: GetcatalogfeaturedByIdStepInput, { container }) => {
    const catalogService: cataloChightlighthightlightModuleService =
      container.resolve(catalogfeatured_MODULE);

    const catalogfeatured = await catalogService.createCatalogfeatureds(input.id);

    return new StepResponse(catalogfeatured, catalogfeatured[0].id);
  }
);

export const getcatalogfeaturedByIdWorkflow = createWorkflow(
  "get-catalogfeatured-by-id",
  (input: GetcatalogfeaturedByIdStepInput) => {
    const catalogfeatured = getcatalogfeaturedByIdStep(input);

    return new WorkflowResponse(catalogfeatured);
  }
);

// Delete cataloChightlight
export type DeletecatalogfeaturedStepInput = {
  id: string;
};

export const deletecatalogfeaturedStep = createStep(
  "delete-catalogfeatured-step",
  async (input: DeletecatalogfeaturedStepInput, { container }) => {
    const catalogService: cataloChightlighthightlightModuleService =
      container.resolve(catalogfeatured_MODULE);

    await catalogService.deleteCatalogfeatureds(input.id);

    return new StepResponse(null, input.id);
  }
);

export const deletecatalogfeaturedWorkflow = createWorkflow(
  "delete-catalogfeatured",
  (input: DeletecatalogfeaturedStepInput) => {
    const catalogfeatured = deletecatalogfeaturedStep(input);

    return new WorkflowResponse(catalogfeatured);
  }
);

// Edit cataloChightlight
export type EditcaCaloghightlightStepInput = {
  id: string;
  image?: string;
  link?: string;
};

export const editcaCaloghightlightStep = createStep(
  "edit-catalogfeatured-step",
  async (input: EditcaCaloghightlightStepInput, { container }) => {
    const catalogService: cataloChightlighthightlightModuleService =
      container.resolve(catalogfeatured_MODULE);

    const updateCcatalogfeatured = await catalogService.updateCatalogfeatureds({
      id: input.id,
      image: input.image,
      link: input.link,
    });

    return new StepResponse(updateCcatalogfeatured, updateCcatalogfeatured.id);
  }
);

export const editcaCaloghightlightWorkflow = createWorkflow(
  "edit-catalogfeatured",
  (input: EditcaCaloghightlightStepInput) => {
    const catalogfeatured = editcaCaloghightlightStep(input);

    return new WorkflowResponse(catalogfeatured);
  }
);

// Get All cataloChightlights
export const getAllcatalogfeaturedsStep = createStep(
  "get-all-catalogfeatured-step",
  async (_, { container }) => {
    const catalogService: cataloChightlighthightlightModuleService =
      container.resolve(catalogfeatured_MODULE);

    const catalogfeatured = await catalogService.listCatalogfeatureds();

    return new StepResponse(
      catalogfeatured,
      catalogfeatured.map((catalogfeatured) => catalogfeatured.id)
    );
  }
);

export const getAllcatalogfeaturedsWorkflow = createWorkflow(
  "get-all-catalogfeatured",
  () => {
    const catalogfeatured = getAllcatalogfeaturedsStep();

    return new WorkflowResponse(catalogfeatured);
  }
);
