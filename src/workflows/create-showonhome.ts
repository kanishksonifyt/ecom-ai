import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { SHOWONHOME_MODULE } from "../modules/showathome";
import ShowonhomepageModuleService from "../modules/showathome/service";

export type CreateShowonHomeStepInput = {
  product_id: string;
};

export const createShowonHomeStep = createStep(
  "create-showonhome-step",
  async (input: CreateShowonHomeStepInput, { container }) => {
    const ShowonhomeModuleService: ShowonhomepageModuleService =
      container.resolve(SHOWONHOME_MODULE);

    const showonhome = await ShowonhomeModuleService.createShow_on_homepages(
      input
    );

    return new StepResponse(showonhome);
  }
);

// ...

type CreateShowonHomeWorkflowInput = {
  product_id: string;
};

export const createShowonHomeWorkflow = createWorkflow(
  "create-brand",
  (input: CreateShowonHomeWorkflowInput) => {
    const brand = createShowonHomeStep(input);

    return new WorkflowResponse(brand);
  }
);

export type DeleteShowonHomeStepInput = {
  id: string;
};

export const deleteShowonHomeStep = createStep(
  "delete-showonhome-step",
  async (input: DeleteShowonHomeStepInput, { container }) => {
    const ShowonhomeModuleService: ShowonhomepageModuleService =
      container.resolve(SHOWONHOME_MODULE);

    console.log("input", input);

    try {
      await ShowonhomeModuleService.deleteShow_on_homepages(input);
    } catch (error) {
      console.error("Error deleting show on home:", error);
    }

    return new StepResponse(null, input);
  }
);

type DeleteShowonHomeWorkflowInput = {
  id: string;
};

export const deleteShowonHomeWorkflow = createWorkflow(
  "delete-showonhome",
  (input: DeleteShowonHomeWorkflowInput) => {

    const result = deleteShowonHomeStep(input);
    return new WorkflowResponse(result);
    }
  );
export type GetShowonHomeStepInput = {
  id: string;
};

export const getShowonHomeStep = createStep(
  "get-showonhome-step",
  async (input: GetShowonHomeStepInput, { container }) => {
    const ShowonhomeModuleService: ShowonhomepageModuleService =
      container.resolve(SHOWONHOME_MODULE);

    const showonhome = await ShowonhomeModuleService.listShow_on_homepages(
      input.product_id
    );

    return new StepResponse(showonhome, showonhome[0].id);
  }
);

type GetShowonHomeWorkflowInput = {
  product_id: string;
};

export const getShowonHomeWorkflow = createWorkflow(
  "get-showonhome",
  (input: GetShowonHomeWorkflowInput) => {
    const showonhome = getShowonHomeStep(input);

    return new WorkflowResponse(showonhome);
  }
);

export const getAllShowonHomeStep = createStep(
  "get-all-showonhome-step",
  async (_, { container }) => {
    const ShowonhomeModuleService: ShowonhomepageModuleService =
      container.resolve(SHOWONHOME_MODULE);

    const showonhome = await ShowonhomeModuleService.listShow_on_homepages();

    return new StepResponse(showonhome, showonhome.map(item => item.id));
  }
);

export const getAllShowonHomeWorkflow = createWorkflow(
  "get-all-showonhome",
  () => {
    const showonhome = getAllShowonHomeStep();

    return new WorkflowResponse(showonhome);
  }
);