import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  updatePointWorkflow,
  deletePointWorkflow,
  getPointByIdWorkflow,
  getPointByOwnerIdWorkflow,
} from "../../../../workflows/create-point";
import { z } from "zod";
import { updatePointValidator } from "../validators";

type updatePointValidatorType = z.infer<typeof updatePointValidator>;

// PATCH route: Update an existing Point
export const PUT = async (
  req: MedusaRequest<updatePointValidatorType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  console.log("patch route hit",req.body)
  if (!id) {
    return res.status(400).json({ message: "Point ID is required" });
  }

  const parsedBody = updatePointValidator.parse(req.body);

  const updatedPoint = await updatePointWorkflow(req.scope).run({
    input: { id, ...parsedBody },
  });

  res.json({ point: updatedPoint });
};

// DELETE route: Delete a Point
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Point ID is required" });
  }

  await deletePointWorkflow(req.scope).run({ input: { id } });

  res.status(204).send({ msg: `${id} was deleted successfully` });
};

// GET route: Get a Point by ID
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  const isproductid = id.startsWith("prod_");
  console.log("route hit");

  if (isproductid) {
    console.log("this function aws run");
    const point = await getPointByOwnerIdWorkflow(req.scope).run({
      input: { owner_id: id },
    });

    res.json({ point });
  } else {
    const point = await getPointByIdWorkflow(req.scope).run({ input: { id } });
    res.json({point})
  }

};
