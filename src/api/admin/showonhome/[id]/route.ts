import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  deleteShowonHomeWorkflow,
  createShowonHomeWorkflow,
} from "../../../../workflows/create-showonhome";

export const DELETE = async  (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { id } = req.params;
    console.log("route hit", id);
    await deleteShowonHomeWorkflow(req.scope).run({ input: { id } });

    res.status(204).send({
      msg: ` was deleted suc`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ...
import { z } from "zod";
import { PostAdminCreateShowonhome } from "./validators";

type PostAdminCreateShowonhomeType = z.infer<typeof PostAdminCreateShowonhome>;

// ...

export const POST = async (
  req: MedusaRequest<PostAdminCreateShowonhomeType>,
  res: MedusaResponse
) => {
  const { id: product_id } = req.params;
  console.log("route hit", product_id);
  const { result } = await createShowonHomeWorkflow(req.scope).run({
    input: { product_id },
  });

  res.json({ brand: result });
};
