import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { cancelOrderWorkflow } from "@medusajs/medusa/core-flows";

export default async function getByOwnerIdRoute(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const cancel_order = cancelOrderWorkflow(req.scope);
    res.status(200).json(cancel_order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}