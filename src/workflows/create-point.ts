import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { POINT_MODULE } from "../modules/point";
import PointModuleService from "../modules/point/service";

export type CreatePointStepInput = {
  coins: string;
  relatedto: string;
  owner_id: string;
};

export const createPointStep = createStep(
  "create-point-step",
  async (input: CreatePointStepInput, { container }) => {
    const PointModuleService: PointModuleService =
      container.resolve(POINT_MODULE);

    const point = await PointModuleService.createPoints(input);

    return new StepResponse(point, point.id);
  }
);

type CreatePointWorkflowInput = {
  coins: string;
  relatedto: string;
  owner_id: string;
};

export const createPointWorkflow = createWorkflow(
  "create-point",
  (input: CreatePointWorkflowInput) => {
    const point = createPointStep(input);

    return new WorkflowResponse(point);
  }
);

export const getAllPointsStep = createStep(
  "get-all-points-step",
  async (_, { container }) => {
    const PointModuleService: PointModuleService =
      container.resolve(POINT_MODULE);

    const points = await PointModuleService.listPoints();

    return new StepResponse(points);
  }
);

export const getAllPointsWorkflow = createWorkflow("get-all-points", () => {
  const points = getAllPointsStep();

  return new WorkflowResponse(points);
});

export type UpdatePointStepInput = {
  id: string;
  coins?: number;
  relatedto?: string;
  owner_id?: string;
};

export const updatePointStep = createStep(
  "update-point-step",
  async (input: UpdatePointStepInput, { container }) => {
    const PointModuleService: PointModuleService =
      container.resolve(POINT_MODULE);

    const updatedPoint = await PointModuleService.updatePoints({
      id: input.id,
      coins: input.coins,
      relatedto: input.relatedto,
      owner_id: input.owner_id,
    });

    return new StepResponse(updatedPoint, updatedPoint.id);
  }
);

type UpdatePointWorkflowInput = {
  id: string;
  coins?: number;
  relatedto?: string;
  owner_id?: string;
};

export const updatePointWorkflow = createWorkflow(
  "update-point",
  (input: UpdatePointWorkflowInput) => {
    const updatedPoint = updatePointStep(input);

    return new WorkflowResponse(updatedPoint);
  }
);

export type DeletePointStepInput = {
  id: string;
};

export const deletePointStep = createStep(
  "delete-point-step",
  async (input: DeletePointStepInput, { container }) => {
    const PointModuleService: PointModuleService =
      container.resolve(POINT_MODULE);

    await PointModuleService.deletePoints(input.id);

    return new StepResponse(null, input.id);
  }
);

type DeletePointWorkflowInput = {
  id: string;
};

export const deletePointWorkflow = createWorkflow(
  "delete-point",
  (input: DeletePointWorkflowInput) => {
    const result = deletePointStep(input);

    return new WorkflowResponse(result);
  }
);

type GetPointByIdWorkflowInput = {
  owner_id: string
}

export const getHomeByOwnerIdStep = createStep(
  "get-home-by-id-step",
  async (input: GetPointByIdWorkflowInput, { container }) => {
    const PointModuleService: PointModuleService =
      container.resolve(POINT_MODULE);

    // console.log("input", input.id);

    const point = await PointModuleService.listPoints({owner_id : input.owner_id});

    return new StepResponse(point);
  }
);





export const getPointByOwnerIdWorkflow = createWorkflow(
  "get-point-by-owner-id",
  (input: GetPointByIdWorkflowInput) => {
    const point = getHomeByOwnerIdStep(input);
    return new WorkflowResponse(point);
  }
)


export type GetHomeByIdStepInput = {
  id: string;
};

export const getHomeByIdStep = createStep(
  "get-home-by-id-step",
  async (input: GetHomeByIdStepInput, { container }) => {
    const PointModuleService: PointModuleService =
      container.resolve(POINT_MODULE);

    // console.log("input", input.id);

    const home = await PointModuleService.retrievePoint(input.id);

    return new StepResponse(home, home);
  }
);

type GetHomeByIdWorkflowInput = {
  id: string;
};

export const getPointByIdWorkflow = createWorkflow(
  "get-home-by-id",
  (input: GetHomeByIdWorkflowInput) => {
    const home = getHomeByIdStep(input);

    return new WorkflowResponse(home);
  }
);
