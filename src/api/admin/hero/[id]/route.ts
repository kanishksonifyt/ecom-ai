import {
  deleteHeroWorkflow,
  editHeroWorkflow,
  reorderHeroesWorkflow,
} from "../../../../workflows/create-hero";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import HeroModuleService from "../../../../modules/hero/service";
import { PutAdminEditHero, PatchAdminReorderHero } from "../validators";
import { z } from "zod";
import { HERO_MODULE } from "../../../../modules/hero";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  // console.log("route hit")

  // Run the delete workflow
  await deleteHeroWorkflow(req.scope).run({ input: { id } });

  // Send a 204 No Content response to indicate successful deletion
  res.status(204).send({
    msg: `${id} ws deleted suc`,
  });
};

type PutAdminEditHeroType = z.infer<typeof PutAdminEditHero>;

export const PUT = async (
  req: MedusaRequest<PutAdminEditHeroType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Hero id is required" });
  }
  const { body } = req;
  // console.log("route hit", id);

  // Validate the request body
  const parsedBody = PutAdminEditHero.parse(body);

  // Run the edit workflow
  const updatedHero = await editHeroWorkflow(req.scope).run({
    input: { id, ...parsedBody },
  });

  // Send the updated hero data in the response
  res.json({ hero: updatedHero });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  // console.log("route hit", id);

  const heroModuleService: HeroModuleService = req.scope.resolve(HERO_MODULE);

  // Fetch the hero by id
  const hero = await heroModuleService.listHeroes(id);

  if (!hero) {
    return res.status(404).json({ message: "Hero not found" });
  }

  // Send the hero data in the response
  res.json({ hero });
};

type PatchAdminReorderHeroType = z.infer<typeof PatchAdminReorderHero>;

export const PATCH = async (
  req: MedusaRequest<PatchAdminReorderHeroType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const { body } = req;

  // console.log("route hit", id);
  const parsedBody = PatchAdminReorderHero.parse(body);
  // Validate the request body if needed
  // const parsedBody = SomeValidator.parse(body);

  // Run the reorder workflow
  let reorderedHeroes;
  if (typeof body === "object" && body !== null) {
    reorderedHeroes = await reorderHeroesWorkflow(req.scope).run({
      input: { id, newIndex: parsedBody.newIndex },
    });
  }

  // Send the reordered heroes data in the response
  res.json({ heroes: reorderedHeroes });
};
