import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getPointByOwnerIdWorkflow } from "../../../../../workflows/create-point";

export default async function getByOwnerIdRoute(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    const points = getPointByOwnerIdWorkflow(req.scope);
    res.status(200).json(points);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}