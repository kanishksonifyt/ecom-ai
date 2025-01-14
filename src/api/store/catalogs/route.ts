import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  getAllCatalogsWorkflow,
} from "../../../workflows/create-catalog";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllCatalogsWorkflow(req.scope).run();

  res.json({ catalogs: result });
};
