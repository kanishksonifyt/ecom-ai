import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { HOMEPAGE_MODULE } from "../modules/homepage";
import HomepageModuleService from "../modules/homepage/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export type CreateHomeStepInput = {
  title: string;
  route: string;
  index: number;
  redirect?: string;
  text?: string;
};

export const createHomeStep = createStep(
  "create-home-step",
  async (input: CreateHomeStepInput, { container }) => {
    const HomepageModuleService: HomepageModuleService =
      container.resolve(HOMEPAGE_MODULE);

    // Ensure the home data has an index
    const existingHomes = await HomepageModuleService.listHomepages();
    const homeIndex = existingHomes.length + 1;
    input.index = homeIndex;

    const home = await HomepageModuleService.createHomepages(input);

    return new StepResponse(home, home.id);
  }
);

type CreateHomeWorkflowInput = {
  title: string;
  route: string;
  index: number;
  redirect?: string;
  text?: string;
};

export const createHomeWorkflow = createWorkflow(
  "create-home",
  (input: CreateHomeWorkflowInput) => {
    const home = createHomeStep(input);

    return new WorkflowResponse(home);
  }
);

export type GetHomeStepInput = {
  id: string;
};

export const getHomeStep = createStep(
  "get-home-step",
  async (input: GetHomeStepInput, { container }) => {
    const HomepageModuleService: HomepageModuleService =
      container.resolve(HOMEPAGE_MODULE);

    const homes = await HomepageModuleService.listHomepages();

    return new StepResponse(
      homes,
      homes.map((home) => home.id)
    );
  }
);

type GetHomeWorkflowInput = {
  id: string;
};

export const getHomeWorkflow = createWorkflow(
  "get-home",
  (input: GetHomeWorkflowInput) => {
    const home = getHomeStep(input);

    return new WorkflowResponse(home);
  }
);

// Type for the Delete Home Step Input
export type DeleteHomeStepInput = {
  id: string;
};

// Step to delete a home
export const deleteHomeStep = createStep(
  "delete-home-step",
  async (input: DeleteHomeStepInput, { container }) => {
    const HomepageModuleService: HomepageModuleService =
      container.resolve(HOMEPAGE_MODULE);

    // Delete the home using the provided ID
    await HomepageModuleService.deleteHomepages(input.id);

    // Respond with the ID of the deleted home
    return new StepResponse(null, input.id);
  }
);

// Type for the input to the Delete Home Workflow
type DeleteHomeWorkflowInput = {
  id: string;
};

// Workflow for deleting a home
export const deleteHomeWorkflow = createWorkflow(
  "delete-home",
  (input: DeleteHomeWorkflowInput) => {
    // Execute the delete home step
    const home = deleteHomeStep(input);

    return new WorkflowResponse(home);
  }
);

export type EditHomeStepInput = {
  id: string;
  title?: string;
  route?: string;
  index?: number;
  redirect?: string;
  text?: string;
};

export const editHomeStep = createStep(
  "edit-home-step",
  async (input: EditHomeStepInput, { container }) => {
    const HomepageModuleService: HomepageModuleService =
      container.resolve(HOMEPAGE_MODULE);

    // console.log(input);

    const homefound = await HomepageModuleService.retrieveHomepage(input.id);

    // console.log("homefound", homefound);

    const updatedHome = await HomepageModuleService.updateHomepages({
      id: input.id,
      title: input.title,
      route: input.route,
      index: input.index,
      redirect: input.redirect,
      text: input.text,
    });
    if (!updatedHome) {
      throw new Error(`Home with id ${input.id} not found`);
    }

    return new StepResponse(updatedHome, updatedHome.id);
  }
);

type EditHomeWorkflowInput = {
  id: string;
  title?: string;
  route?: string;
  index?: number;
  redirect?: string;
  text?: string;
};

export const editHomeWorkflow = createWorkflow(
  "edit-home",
  (input: EditHomeWorkflowInput) => {
    const home = editHomeStep(input);

    return new WorkflowResponse(home);
  }
);

export type GetHomeByIdStepInput = {
  id: string;
};

export const getHomeByIdStep = createStep(
  "get-home-by-id-step",
  async (input: GetHomeByIdStepInput, { container }) => {
    const HomepageModuleService: HomepageModuleService =
      container.resolve(HOMEPAGE_MODULE);

    // console.log("input", input.id);

    const home = await HomepageModuleService.retrieveHomepage(input.id);

    return new StepResponse(home, home);
  }
);

type GetHomeByIdWorkflowInput = {
  id: string;
};

export const getHomeByIdWorkflow = createWorkflow(
  "get-home-by-id",
  (input: GetHomeByIdWorkflowInput) => {
    const home = getHomeByIdStep(input);

    return new WorkflowResponse(home);
  }
);

export type ReorderHomesStepInput = {
  id: string;
  newIndex: number;
};

export const reorderHomesStep = createStep(
  "reorder-homes-step",
  async (input: ReorderHomesStepInput, { container }) => {
    const HomepageModuleService: HomepageModuleService =
      container.resolve(HOMEPAGE_MODULE);
    // Retrieve the home to be reordered
    const home = await HomepageModuleService.retrieveHomepage(input.id);
    if (!home) {
      throw new Error(`Home with id ${input.id} not found`);
    }

    // Retrieve all homes
    const homes = await HomepageModuleService.listHomepages();

    // Remove the home from its current position
    const filteredHomes = homes.filter((h) => h.id !== input.id);

    // console.log("filteredHomes", filteredHomes);

    // Insert the home at the new index
    filteredHomes.splice(input.newIndex - 1, 0, home);

    // Update the index of all homes and save to the database
    const updatedHomes = await Promise.all(
      filteredHomes.map((h, index) => {
        return HomepageModuleService.updateHomepages({
          id: h.id,
          index: index + 1,
        });
      })
    );

    return new StepResponse(
      updatedHomes,
      updatedHomes.map((h) => h.id)
    );
  }
);

type ReorderHomesWorkflowInput = {
  id: string;
  newIndex: number;
};

export const reorderHomesWorkflow = createWorkflow(
  "reorder-homes",
  (input: ReorderHomesWorkflowInput) => {
    const homes = reorderHomesStep(input);

    return new WorkflowResponse(homes);
  }
);
