// getAllProductsWorkflow

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
    getAllProductsWorkflow
} from "../../../workflows/create-product";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllProductsWorkflow(req.scope).run();
  res.json({ result });
};
