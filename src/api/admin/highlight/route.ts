import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createHighlightWorkflow,
  getAllHighlightsWorkflow,
} from "../../../workflows/create-Highlight";
// ...
import { z } from "zod";
import { PostAdminCreateHighlight } from "./validators";

type PostAdminCreateHighlightType = z.infer<typeof PostAdminCreateHighlight>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateHighlightType>,
  res: MedusaResponse
) => {
  const { result } = await createHighlightWorkflow(req.scope).run({
    input: {...req.validatedBody},
  });

  res.json({ Highlight: result });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllHighlightsWorkflow(req.scope).run();
  res.json({ highlights: result });
};
