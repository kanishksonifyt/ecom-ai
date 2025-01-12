import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createFeaturedWorkflow,
  getAllFeaturedsWorkflow,
} from "../../../workflows/create-featured";

import { z } from "zod";
import {
  PostAdminCreateFeatured,
  PatchAdminCreateFeatured,
} from "./validators";

type PostAdminCreateFeaturedType = z.infer<typeof PostAdminCreateFeatured>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateFeaturedType>,
  res: MedusaResponse
) => {
  // console.log("route hit", req.body);
  const { result } = await createFeaturedWorkflow(req.scope).run({
    input: {
      ...req.body,
    },
  });

  res.json({ featured: result });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllFeaturedsWorkflow(req.scope).run();

  res.json({ featureds: result });
};
