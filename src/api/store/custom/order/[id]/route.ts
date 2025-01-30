import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params as { id: string };

  if (!id) {
    res.status(400).send("Customer ID is required");
    return;
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "customer.id",
      "customer.orders.*",
      "customer.orders.",
      "items.*",
    ],
    filters: {
      ...(id ? { customer_id: id as any } : {}),
    },
  });

  

    res.status(200).send({orders , count : orders.length});
    
}
