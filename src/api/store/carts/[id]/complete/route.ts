import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  completeCartWorkflow,
  getOrderDetailWorkflow,
  updateUsersWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createPointWorkflow,
  getAllPointsWorkflow,
  
  getPointByOwnerIdWorkflow,
} from "../../../../../workflows/create-point";
import {
  updatePointWorkflow,
  deletePointWorkflow,
  getPointByIdWorkflow,
} from "../../../../../workflows/create-point";
import { syncOrderToCmsWorkflow } from "../../../../../workflows/sync-sales-to-cmd";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type PostStoreCompleteCartType = {
  id: string;
};

export const POST = async (
  req: MedusaRequest<PostStoreCompleteCartType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // console.log(id, " and the route is hit");
  const { result } = await completeCartWorkflow(req.scope).run({
    input: { id: id },
  });

  const response = await getOrderDetailWorkflow(req.scope).run({
    input: {
      fields: [
        "id",
        "status",
        "summary",
        "currency_code",
        "display_id",
        "region_id",
        "email",
        "total",
        "subtotal",
        "tax_total",
        "discount_total",
        "discount_subtotal",
        "discount_tax_total",
        "original_total",
        "original_tax_total",
        "item_total",
        "item_subtotal",
        "item_tax_total",
        "original_item_total",
        "original_item_subtotal",
        "original_item_tax_total",
        "shipping_total",
        "shipping_subtotal",
        "shipping_tax_total",
        "original_shipping_tax_total",
        "original_shipping_subtotal",
        "original_shipping_total",
        "created_at",
        "updated_at",
        "items",
        "shipping_address.*",
        "billing_address.*",
        "shipping_methods",
        "payment_collections",
      ],
      order_id: result.id,
      // filters: { status: 'completed' },
      version: 1,
    },
  });

  const { data } = await query.graph({
    entity: "user",
    fields: ["*"],
    filters: {
      email: response.result.email,
    },
  });
  const user: any = data[0];

  console.log(user);

 
  const productpoint = await getPointByOwnerIdWorkflow(req.scope).run({
    input: { owner_id: response.result.id },
  }) as any;
  if(productpoint){
    const userpoint = await getPointByOwnerIdWorkflow(req.scope).run({
      input: { owner_id: user.id },
    });
  
    if (!userpoint) {
      const { result } = await createPointWorkflow(req.scope).run({
        input: {
          coins: productpoint.coins ,
          relatedto: "user",
          owner_id: user.id,
        },
      });
    }else{
      const { result } = await updatePointWorkflow(req.scope).run({
        input: {
          id : userpoint.id,
          coins: productpoint.coins + userpoint.coins ,
        },
      });
    }
  }

  await syncOrderToCmsWorkflow(req.scope).run({
    input: response.result,
  });

  res.json({
    type: "order",
    order: response.result,
  });
};
