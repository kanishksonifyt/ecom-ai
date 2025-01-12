import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  editCatalogWorkflow,
  deleteCatalogWorkflow,
} from "../../../../workflows/create-catalog";

import { z } from "zod";
import { PatchAdminCreateCatalog } from "../validators";

type PatchAdminCreateCatalogType = z.infer<typeof PatchAdminCreateCatalog>;

export const PATCH = async (
  req: MedusaRequest<PatchAdminCreateCatalogType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Catalog id is required" });
  }
  const { body } = req;
  // console.log("route hit", id);

  // Validate the request body
  const parsedBody = PatchAdminCreateCatalog.parse(body);

  // Run the edit workflow
  const updatedCatalog = await editCatalogWorkflow(req.scope).run({
    input: { id, ...parsedBody },
  });

  res.json({ catalog: updatedCatalog });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  await deleteCatalogWorkflow(req.scope).run({ input: { id } });

  res.status(204).send({
    msg: `${id} ws deleted suc`,
  });
};
