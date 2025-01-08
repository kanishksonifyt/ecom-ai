import { createOrderWorkflow } from "@medusajs/medusa/core-flows";
import { emitEventStep } from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";

createOrderWorkflow.hooks.orderCreated(async ({ order }, { container }) => {
  emitEventStep({
    eventName: "order.created",
    data: {
      id: order.id,
      email: order.email,
      total: order.total,
      currency_code: order.currency_code,
      currentStatus: order.status,
      display_id: order.display_id,
      customer_id: order.customer_id,
      products: (order.items ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        thumbnail: item.thumbnail,
        variant_id: item.variant_id,
        product_id: item.product_id,
        product_title: item.product_title,
        product_description: item.product_description,
        variant_sku: item.variant_sku,
        variant_title: item.variant_title,
        requires_shipping: item.requires_shipping,
        is_discountable: item.is_discountable,
        is_tax_inclusive: item.is_tax_inclusive,
        raw_unit_price: item.raw_unit_price,
        metadata: item.metadata,
        created_at: item.created_at,
        updated_at: item.updated_at,
        product_subtitle: item.product_subtitle,
        product_type: item.product_type,
        product_type_id: item.product_type_id,
        product_collection: item.product_collection,
        compare_at_unit_price: item.compare_at_unit_price,
        unit_price: item.unit_price,
        quantity: item.quantity,
        raw_quantity: item.raw_quantity,
        detail: item.detail,
        price: item.unit_price,
      })),
    },
  });

  return new StepResponse({ order });
});
