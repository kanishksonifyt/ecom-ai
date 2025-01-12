import {
  deleteHomeWorkflow,
  editHomeWorkflow,
  reorderHomesWorkflow,
  getHomeByIdWorkflow,
} from "../../../../workflows/create-home";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import HeroModuleService from "../../../../modules/homepage/service";
import { PutAdminEditHome, PatchAdminReorderHome } from "../validators";
import { z } from "zod";
import { HERO_MODULE } from "../../../../modules/hero";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  // console.log("route hit")

  // Run the delete workflow
  await deleteHomeWorkflow(req.scope).run({ input: { id } });

  // Send a 204 No Content response to indicate successful deletion
  res.status(204).send({
    msg: `${id} ws deleted suc`,
  });
};

type PutAdminEditHomeType = z.infer<typeof PutAdminEditHome>;

export const PUT = async (
  req: MedusaRequest<PutAdminEditHomeType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "home id is required" });
  }
  const { body } = req;
  // console.log("route hit", id);

  // Validate the request body
  const parsedBody = PutAdminEditHome.parse(body);

  // Run the edit workflow
  const updatedHero = await editHomeWorkflow(req.scope).run({
    input: { id, ...parsedBody },
  });

  // Send the updated hero data in the response
  res.json({ hero: updatedHero });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  // console.log("route hit", id);
  // Run the get workflow
  const home = await getHomeByIdWorkflow(req.scope).run({ input: { id } });

  // Send the hero data in the response
  res.json({ home });
};

type PatchAdminReorderHomeType = z.infer<typeof PatchAdminReorderHome>;

export const PATCH = async (
  req: MedusaRequest<PatchAdminReorderHomeType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const { body } = req;

  // console.log("route hit", id);
  const parsedBody = PatchAdminReorderHome.parse(body);
  // Validate the request body if needed
  // const parsedBody = SomeValidator.parse(body);

  // Run the reorder workflow
  let reorderedHeroes;
  if (typeof body === "object" && body !== null) {
    reorderedHeroes = await reorderHomesWorkflow(req.scope).run({
      input: { id, newIndex: parsedBody.newIndex },
    });
  }

  // Send the reordered heroes data in the response
  res.json({ heroes: reorderedHeroes });
};
