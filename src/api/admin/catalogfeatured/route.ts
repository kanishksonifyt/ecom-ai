import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createcatalogfeaturedWorkflow,
  getAllcatalogfeaturedsWorkflow,
} from "../../../workflows/create-catalogfeatured";

import { z } from "zod";
import { PostAdminCreateCatalog } from "./validators";

type PostAdminCreateCatalogType = z.infer<typeof PostAdminCreateCatalog>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateCatalogType>,
  res: MedusaResponse
) => {
  try {
    const { result } = await createcatalogfeaturedWorkflow(req.scope).run({
      input: req.body,
    });

    res.status(201).json({ catalogfeatured: result });
  } catch (error) {
    console.error("Error creating catalog highlight:", error);
    res
      .status(500)
      .json({ message: "Failed to create catalog highlight", error });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { result } = await getAllcatalogfeaturedsWorkflow(req.scope).run();

    res.status(200).json({ catalogfeatureds: result });
  } catch (error) {
    console.error("Error fetching catalog highlights:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch catalog highlights", error });
  }
};
