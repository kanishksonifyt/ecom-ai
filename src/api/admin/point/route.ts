import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createPointWorkflow,
  getAllPointsWorkflow,
  updatePointWorkflow,
  deletePointWorkflow,
} from "../../../workflows/create-point";
import { z } from "zod";
import { createPointValidator } from "./validators";

// Define the types for Zod validators
type createPointValidatorType = z.infer<typeof createPointValidator>;

// POST route: Create a new Point
export const POST = async (
  req: MedusaRequest<createPointValidatorType>,
  res: MedusaResponse
) => {

    console.log(req.body)
  const { result } = await createPointWorkflow(req.scope).run({
    input: { ...req.body },
  });

  res.json({ point: result });
};

// GET route: Retrieve all Points
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllPointsWorkflow(req.scope).run();
  res.json({ points: result });
};