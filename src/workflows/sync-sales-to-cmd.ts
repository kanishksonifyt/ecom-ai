import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { CMS_MODULE } from "../modules/cms";
import CmsModuleService from "../modules/cms/service";
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import item from "src/modules/item";

interface Order {
  id: string;
  status: string;
  summary: {
    paidTotal: number;
    differenceSum: number;
    currentOrderTotal: number;
    originalOrderTotal: number;
    pendingDifference: number;
  };
  currencyCode: string;
  displayId: string;
  regionId: string;
  email: string;
  total: number;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  createdAt: string;
  updatedAt: string;
  items: [
    {
      id: string;
      title: string;
      subtitle: string;
      thumbnail: string;
      variantId: string;
      productId: string;
      productTitle: string;
      productDescription: string;
      unitPrice: number;
      quantity: number;
      subtotal: number;
      total: number;
    }
  ];
  shipping_methods: {
    id: string;
    name: string;
    amount: number;
  };
  billing_address: {
    id: string;
    customerId: string;
    company: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    countryCode: string;
    province: string;
    postalCode: string;
    phone: string;
    metadata: string;
    createdAt: string;
    updatedAt: string;
  };
  payment_collections: [
    {
      id: string;
      currencyCode: string;
      regionId: string;
      completedAt: string;
      status: string;
      metadata: string;
      rawAmount: number;
      rawAuthorizedAmount: number;
      rawCapturedAmount: number;
      rawRefundedAmount: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      amount: number;
      authorizedAmount: number;
      capturedAmount: number;
      refundedAmount: number;
    }
  ];
}

const syncOrderToCmsStep = createStep(
  "sync-order-to-cms",
  async (order: Order, { container }) => {
    const cmsModuleService: CmsModuleService = container.resolve(CMS_MODULE);

    console.log("input", order.shipping_methods);

    const input = order;
    // Construct the payload to include all order data

    const cmsPayload = {
      id: input.id,
      status: input.status,
      summary: {
        paidTotal: input.summary.paidTotal,
        differenceSum: input.summary.differenceSum,
        currentOrderTotal: input.summary.currentOrderTotal,
        originalOrderTotal: input.summary.originalOrderTotal,
        pendingDifference: input.summary.pendingDifference,
      },
      currencyCode: input.currencyCode,
      displayId: input.displayId,
      regionId: input.regionId,
      email: input.email,
      total: input.total,
      subtotal: input.subtotal,
      taxTotal: input.taxTotal,
      discountTotal: input.discountTotal,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      items: input.items.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        thumbnail: item.thumbnail,
        variantId: item.variantId,
        productId: item.productId,
        productTitle: item.productTitle,
        productDescription: item.productDescription,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
        total: item.total,
      })),
      shipping_methods: {
        id: input.shipping_methods[0].id,
        name: input.shipping_methods[0].name,
        amount: input.shipping_methods[0].amount,
      },

      billingAddress: {
        id: input.billing_address.id,
        customerId: input.billing_address.customerId,
        company: input.billing_address.company,
        firstName: input.billing_address.firstName,
        lastName: input.billing_address.lastName,
        address1: input.billing_address.address1,
        address2: input.billing_address.address2,
        city: input.billing_address.city,
        countryCode: input.billing_address.countryCode,
        province: input.billing_address.province,
        postalCode: input.billing_address.postalCode,
        phone: input.billing_address.phone,
        metadata: input.billing_address.metadata,
        createdAt: input.billing_address.createdAt,
        updatedAt: input.billing_address.updatedAt,
      },
      paymentCollections: input.payment_collections.map((collection) => ({
        id: collection.id,
        currencyCode: collection.currencyCode,
        regionId: collection.regionId,
        completedAt: collection.completedAt,
        status: collection.status,
        metadata: collection.metadata,
        rawAmount: collection.rawAmount,
        rawAuthorizedAmount: collection.rawAuthorizedAmount,
        rawCapturedAmount: collection.rawCapturedAmount,
        rawRefundedAmount: collection.rawRefundedAmount,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        deletedAt: collection.deletedAt,
        amount: collection.amount,
        authorizedAmount: collection.authorizedAmount,
        capturedAmount: collection.capturedAmount,
        refundedAmount: collection.refundedAmount,
      })),
    };

    // Send data to the CMS module
    await cmsModuleService.createSalesOrder(cmsPayload);

    // Return StepResponse with relevant info
    return new StepResponse(null, { id: order.id });
  },
  async (data, { container }) => {
    if (!data || !data.id) {
      return;
    }

    const cmsModuleService: CmsModuleService = container.resolve(CMS_MODULE);

    // Delete the sales order in CMS by ID
    await cmsModuleService.deleteSalesOrder(data.id);
  }
);

export const syncOrderToCmsWorkflow = createWorkflow(
  "sync-order-to-cms",
  (input: any) => {
    const { order } = syncOrderToCmsStep(input);

    return new WorkflowResponse({
      order,
    });
  }
);
