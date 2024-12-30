import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
    getFeaturedByIdWorkflow,
    deleteFeaturedWorkflow,
    editFeaturedWorkflow
} from "../../../../workflows/create-featured";

import { z } from "zod";
import { PatchAdminCreateFeatured } from "../validators";

type PatchAdminCreateFeaturedType = z.infer<typeof PatchAdminCreateFeatured>;

export const PATCH = async (
  req: MedusaRequest<PatchAdminCreateFeaturedType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Catalog id is required" });
  }
  const { body } = req;
  console.log("route hit", id);

  // Validate the request body
  const parsedBody = PatchAdminCreateFeatured.parse(body);

  // Run the edit workflow
  const updatedCatalog = await editFeaturedWorkflow(req.scope).run({
    input: { id, ...parsedBody },
  });

  res.json({ catalog: updatedCatalog });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  await deleteFeaturedWorkflow(req.scope).run({ input: { id } });

  res.status(204).send({
    msg: `${id} ws deleted suc`,
  });
};
