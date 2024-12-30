import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createHomeWorkflow ,getHomeWorkflow } from "../../../workflows/create-home";
import { z } from "zod";
import { PostAdminCreateHome } from "./validators";


type PostAdminCreateHomeType = z.infer<typeof PostAdminCreateHome>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateHomeType>,
  res: MedusaResponse
) => {

    console.log("route hit")
    console.log(req.body)
  const { result } = await createHomeWorkflow(req.scope).run({
    input: {
      ...req.body,
      index: req.body?.index || 0, // Add a default value for index if not provided
    },
  });

  res.json({ hero: result });
};
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { result } = await getHomeWorkflow(req.scope).run();
    result.sort((a, b) => a.index - b.index);
    res.json({ heroes: result });
};



