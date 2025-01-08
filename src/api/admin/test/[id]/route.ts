import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getOrderDetailWorkflow } from "@medusajs/medusa/core-flows";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
//   const getOrderDetailWorkflow = req.scope.resolve("getOrderDetailWorkflow");

  try {

    const scope ={
      "options": {
          "injectionMode": "PROXY"
      },
      "cradle": "[object AwilixContainerCradle]",
      "cache": {},
      "registrations": {
          "configModule": {
              "lifetime": "TRANSIENT"
          },
          "featureFlagRouter": {
              "lifetime": "TRANSIENT"
          },
          "logger": {},
          "remoteQuery": {},
          "__pg_connection__": {},
          "query": {},
          "remoteLink": {},
          "cache": {},
          "event_bus": {},
          "workflows": {},
          "locking": {},
          "stock_location": {},
          "inventory": {},
          "product": {},
          "pricing": {},
          "promotion": {},
          "customer": {},
          "sales_channel": {},
          "cart": {},
          "region": {},
          "api_key": {},
          "store": {},
          "tax": {},
          "currency": {},
          "payment": {},
          "order": {},
          "auth": {},
          "user": {},
          "file": {},
          "fulfillment": {},
          "notification": {},
          "cms": {},
          "hero": {},
          "hightlight": {},
          "catalog": {},
          "featured": {},
          "item": {},
          "showonhome": {},
          "review": {},
          "homepage": {},
          "index": {}
      }
  }
    const workflow = getOrderDetailWorkflow(scope);

    // const workflow = getOrderDetailWorkflow(); // Call without scope if supported

    const response = await workflow.run({
      input: {
        fields: [
          'id', 'status', 'total', 'customer_id', 'shipping_address', 
          'billing_address', 'payment', 'shipping_methods', 'fulfillment', 
          'created_at', 'updated_at', 'cart', 'discounts', 'payments', 
          'refunds', 'shipping_total', 'tax_total', 'subtotal', 'total', 
          'gift_cards', 'metadata', 'items',
        ],
        order_id: id,
        // filters: { status: 'completed' },
        version: 1,
      },
    });

    res.json({   order: response.result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
