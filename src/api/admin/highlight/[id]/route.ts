import {
  updateHighlightWorkflow,
  deleteHighlightWorkflow,
} from "../../../../workflows/create-Highlight";

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { PatchAdminEditHero } from "../validators";

type PatchAdminEditHeroType = z.infer<typeof PatchAdminEditHero>;

export const PATCH = async (
  req: MedusaRequest<PatchAdminEditHeroType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Hero id is required" });
  }
  const { body } = req;
  console.log("route hit", id);

  console.log("body", body);

  // Validate the request body
  const parsedBody = PatchAdminEditHero.parse(body);

  // Run the edit workflow
  const updatedHero = await updateHighlightWorkflow(req.scope).run({
    input: { id, ...parsedBody },
  });

  res.json({ Highlight: updatedHero });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  await deleteHighlightWorkflow(req.scope).run({ input: { id } });

  res.status(204).send({
    msg: `${id} ws deleted suc`,
  });
};
