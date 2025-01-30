import { Router } from "express";
import bodyParser from "body-parser";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PaymentStatusCodeValues } from "../phonepe-types";
import { createPostCheckSumHeader } from "../phonepe-create-post-checksum-header";
import { sleep } from "../sleep";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService } from "@medusajs/framework/types"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { IOrderModuleService } from "@medusajs/framework/types"

const router = Router();
router.use(bodyParser.urlencoded({ extended: true }));

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService : IOrderModuleService = req.scope.resolve(Modules.ORDER);
    const data = req.body as any;
    
    // Validate required parameters
    const receivedChecksum = data["checksum"];
    const merchantTransactionId = data["transactionId"];
    const code = data["code"];
    const merchantId = data["merchantId"];
    
    let verificationData = "";
    let cartId = merchantTransactionId;
    const redirectErrorPath = `/cart`;
    let redirectPath = redirectErrorPath;

    if (!cartId) return res.redirect(302, redirectErrorPath);

    try {
        // Extract cart ID from transaction ID
        const cartIdParts = cartId.split("_");
        cartId = `${cartIdParts[0]}_${cartIdParts[1]}`;
        console.log(`Processing payment for cart: ${cartId}`);

        // Validate payment success status
        if (code !== PaymentStatusCodeValues.PAYMENT_SUCCESS) {
            console.warn(`Payment failed with code: ${code}`);
            return res.redirect(302, redirectErrorPath);
        }

        // Verify checksum
        Object.keys(data).forEach((key) => {
            if (key !== "checksum") verificationData += data[key];
        });

        const { checksum } = createPostCheckSumHeader(
            verificationData,
            process.env.PHONEPE_SALT,
            ""
        );

        if (checksum !== receivedChecksum && !process.env.TEST_DISABLED) {
            console.error(`Checksum mismatch: received ${receivedChecksum}, computed ${checksum}`);
            return res.redirect(302, redirectErrorPath);
        }

        // Attempt to find existing order
        let order;
        let retries = 0;
        while (retries < 10) {
            try {
                const { data : order } = await orderService.listOrders({
                    filters: {
                      cart_id: cartId
                    }
                  })
                
                
                if (order) break;
            } catch (e) {
                await sleep(1000);
                retries++;
            }
        }

        // If order found, redirect to confirmation
        if (order) {
            redirectPath = `/order/confirmed/${order.id}`;
        } else {
            // Complete cart workflow if order not found
            console.log("Attempting to complete cart...");
            const { result }: any = await completeCartWorkflow(req.scope).run({
                input: { id: cartId }
            });

            if (result.type === "order") {
                console.log(`Order created through workflow: ${result.order.id}`);
                redirectPath = `/order/confirmed/${result.order.id}`;
            } else {
                console.error("Cart completion failed:", result.error);
            }
        }
    } catch (err) {
        console.error("Payment processing error:", err);
    }

    const finalUrl = `${req.protocol}://${req.get("host")}${redirectPath}`;
    console.log(`Final redirect to: ${finalUrl}`);
    return res.redirect(302, finalUrl);
};