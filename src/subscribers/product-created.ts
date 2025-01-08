import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { emitEventStep } from "@medusajs/medusa/core-flows";
import { eventNames } from "process";

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    const productId = data.id;

    // Resolve the Product Module Service
    const productModuleService: IProductModuleService = container.resolve(
      Modules.PRODUCT
    );

    // Resolve the Event Bus Service
    // const eventBusService: EventBusService = container.resolve("eventBusService");

    // Emit an example event (order.created)
    const result =  emitEventStep({
      eventName: "order.created",
      data: {
        orderId: data.id, // Replace with actual order ID if needed
      }
    });
    console.log("Event emitted result:", result); // Will log undefined

    // Retrieve the product details using its ID
    const product = await productModuleService.retrieveProduct(productId);

    // Log the product details
    console.log(`The product "${product.title}" was created successfully`);
  } catch (error) {
    console.error("Error handling the product.created event:", error);
  }
}

// Configuration for the subscriber
export const config: SubscriberConfig = {
  event: "product.created", // Event to listen for
};
