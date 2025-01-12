import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createHeroWorkflow,
  getHeroWorkflow,
  deleteHeroWorkflow,
  editHeroWorkflow,
} from "../../../workflows/create-hero";
import { z } from "zod";
import { PostAdminCreateHero } from "./validators";

type PostAdminCreateHeroType = z.infer<typeof PostAdminCreateHero>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateHeroType>,
  res: MedusaResponse
) => {
  // console.log("route hit")
  console;
  const { result } = await createHeroWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      index: req.validatedBody?.index || 0, // Add a default value for index if not provided
    },
  });

  res.json({ hero: result });
};
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getHeroWorkflow(req.scope).run();
  result.sort((a, b) => a.index - b.index);
  res.json({ heroes: result });
};
