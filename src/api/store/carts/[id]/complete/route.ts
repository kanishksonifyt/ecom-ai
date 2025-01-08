import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  completeCartWorkflow,
  getOrderDetailWorkflow,
} from "@medusajs/medusa/core-flows";
import {syncOrderToCmsWorkflow} from "../../../../../workflows/sync-sales-to-cmd";

type PostStoreCompleteCartType = {
  id: string;
};

export const POST = async (
  req: MedusaRequest<PostStoreCompleteCartType>,
  res: MedusaResponse
) => {
  const { id } = req.params;

  console.log(id, " and the route is hit");
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
        "payment_collections"
      ],
      order_id: result.id,
      // filters: { status: 'completed' },
      version: 1,
    },
  });

  await syncOrderToCmsWorkflow(req.scope).run({
          input: response.result,
        })


  // console.log(result, " and the result is here");
  // console.log(response, " and the response is here");

  res.json({
    type: "order",
    order: response.result,
  });
};



// {
//     "type": "order",
//     "order": {
//         "id": "order_01JH27XJ1J2V07M2B2V8MB6TWM",
//         "status": "pending",
//         "summary": {
//             "paid_total": 0,
//             "difference_sum": 0,
//             "raw_paid_total": {
//                 "value": "0",
//                 "precision": 20
//             },
//             "refunded_total": 0,
//             "credit_line_total": 0,
//             "transaction_total": 0,
//             "pending_difference": 20,
//             "raw_difference_sum": {
//                 "value": "0",
//                 "precision": 20
//             },
//             "raw_refunded_total": {
//                 "value": "0",
//                 "precision": 20
//             },
//             "current_order_total": 20,
//             "original_order_total": 20,
//             "raw_credit_line_total": {
//                 "value": "0",
//                 "precision": 20
//             },
//             "raw_transaction_total": {
//                 "value": "0",
//                 "precision": 20
//             },
//             "raw_pending_difference": {
//                 "value": "20",
//                 "precision": 20
//             },
//             "raw_current_order_total": {
//                 "value": "20",
//                 "precision": 20
//             },
//             "raw_original_order_total": {
//                 "value": "20",
//                 "precision": 20
//             }
//         },
//         "currency_code": "eur",
//         "display_id": 25,
//         "region_id": "reg_01JFY5AJZRMXAP0NS1JXT8GATB",
//         "email": "kanishk21soni@gmail.com",
//         "total": 20,
//         "subtotal": 20,
//         "tax_total": 0,
//         "discount_total": 0,
//         "discount_subtotal": 0,
//         "discount_tax_total": 0,
//         "original_total": 20,
//         "original_tax_total": 0,
//         "item_total": 10,
//         "item_subtotal": 10,
//         "item_tax_total": 0,
//         "original_item_total": 10,
//         "original_item_subtotal": 10,
//         "original_item_tax_total": 0,
//         "shipping_total": 10,
//         "shipping_subtotal": 10,
//         "shipping_tax_total": 0,
//         "original_shipping_tax_total": 0,
//         "original_shipping_subtotal": 10,
//         "original_shipping_total": 10,
//         "created_at": "2025-01-08T05:59:07.061Z",
//         "updated_at": "2025-01-08T05:59:07.061Z",
//         "items": [
//             {
//                 "id": "ordli_01JH27XJ1KZPE2FMTB6S948PM6",
//                 "title": "M",
//                 "subtitle": "Medusa Sweatshirt",
//                 "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
//                 "variant_id": "variant_01JFY5AK8EVDRNCYTNKDT1ZXS8",
//                 "product_id": "prod_01JFY5AK5P9QVWVJ9PDK6YDQX6",
//                 "product_title": "Medusa Sweatshirt",
//                 "product_description": "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
//                 "product_subtitle": null,
//                 "product_type": null,
//                 "product_type_id": null,
//                 "product_collection": null,
//                 "product_handle": "sweatshirt",
//                 "variant_sku": "SWEATSHIRT-M",
//                 "variant_barcode": null,
//                 "variant_title": "M",
//                 "variant_option_values": null,
//                 "requires_shipping": true,
//                 "is_discountable": true,
//                 "is_tax_inclusive": false,
//                 "raw_compare_at_unit_price": null,
//                 "raw_unit_price": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "is_custom_price": false,
//                 "metadata": {},
//                 "created_at": "2025-01-08T05:59:07.061Z",
//                 "updated_at": "2025-01-08T05:59:07.061Z",
//                 "deleted_at": null,
//                 "tax_lines": [],
//                 "adjustments": [],
//                 "compare_at_unit_price": null,
//                 "unit_price": 10,
//                 "quantity": 1,
//                 "raw_quantity": {
//                     "value": "1",
//                     "precision": 20
//                 },
//                 "detail": {
//                     "id": "orditem_01JH27XJ1MJJBX8PTSRSNEVA1G",
//                     "order_id": "order_01JH27XJ1J2V07M2B2V8MB6TWM",
//                     "version": 1,
//                     "item_id": "ordli_01JH27XJ1KZPE2FMTB6S948PM6",
//                     "raw_unit_price": null,
//                     "raw_compare_at_unit_price": null,
//                     "raw_quantity": {
//                         "value": "1",
//                         "precision": 20
//                     },
//                     "raw_fulfilled_quantity": {
//                         "value": "0",
//                         "precision": 20
//                     },
//                     "raw_delivered_quantity": {
//                         "value": "0",
//                         "precision": 20
//                     },
//                     "raw_shipped_quantity": {
//                         "value": "0",
//                         "precision": 20
//                     },
//                     "raw_return_requested_quantity": {
//                         "value": "0",
//                         "precision": 20
//                     },
//                     "raw_return_received_quantity": {
//                         "value": "0",
//                         "precision": 20
//                     },
//                     "raw_return_dismissed_quantity": {
//                         "value": "0",
//                         "precision": 20
//                     },
//                     "raw_written_off_quantity": {
//                         "value": "0",
//                         "precision": 20
//                     },
//                     "metadata": null,
//                     "created_at": "2025-01-08T05:59:07.062Z",
//                     "updated_at": "2025-01-08T05:59:07.062Z",
//                     "deleted_at": null,
//                     "unit_price": null,
//                     "compare_at_unit_price": null,
//                     "quantity": 1,
//                     "fulfilled_quantity": 0,
//                     "delivered_quantity": 0,
//                     "shipped_quantity": 0,
//                     "return_requested_quantity": 0,
//                     "return_received_quantity": 0,
//                     "return_dismissed_quantity": 0,
//                     "written_off_quantity": 0
//                 },
//                 "subtotal": 10,
//                 "total": 10,
//                 "original_total": 10,
//                 "discount_total": 0,
//                 "discount_subtotal": 0,
//                 "discount_tax_total": 0,
//                 "tax_total": 0,
//                 "original_tax_total": 0,
//                 "refundable_total_per_unit": 10,
//                 "refundable_total": 10,
//                 "fulfilled_total": 0,
//                 "shipped_total": 0,
//                 "return_requested_total": 0,
//                 "return_received_total": 0,
//                 "return_dismissed_total": 0,
//                 "write_off_total": 0,
//                 "raw_subtotal": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_total": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_original_total": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_discount_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_discount_subtotal": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_discount_tax_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_tax_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_original_tax_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_refundable_total_per_unit": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_refundable_total": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_fulfilled_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_shipped_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_return_requested_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_return_received_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_return_dismissed_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_write_off_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "variant": {
//                     "id": "variant_01JFY5AK8EVDRNCYTNKDT1ZXS8",
//                     "title": "M",
//                     "sku": "SWEATSHIRT-M",
//                     "barcode": null,
//                     "ean": null,
//                     "upc": null,
//                     "allow_backorder": false,
//                     "manage_inventory": true,
//                     "hs_code": null,
//                     "origin_country": null,
//                     "mid_code": null,
//                     "material": null,
//                     "weight": null,
//                     "length": null,
//                     "height": null,
//                     "width": null,
//                     "metadata": null,
//                     "variant_rank": 0,
//                     "product_id": "prod_01JFY5AK5P9QVWVJ9PDK6YDQX6",
//                     "product": {
//                         "id": "prod_01JFY5AK5P9QVWVJ9PDK6YDQX6",
//                         "title": "Medusa Sweatshirt",
//                         "handle": "sweatshirt",
//                         "subtitle": null,
//                         "description": "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
//                         "is_giftcard": false,
//                         "status": "published",
//                         "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
//                         "weight": "400",
//                         "length": null,
//                         "height": null,
//                         "width": null,
//                         "origin_country": null,
//                         "hs_code": null,
//                         "mid_code": null,
//                         "material": null,
//                         "discountable": true,
//                         "external_id": null,
//                         "metadata": null,
//                         "type_id": null,
//                         "type": null,
//                         "collection_id": null,
//                         "collection": null,
//                         "created_at": "2024-12-25T05:41:08.905Z",
//                         "updated_at": "2024-12-25T05:41:08.905Z",
//                         "deleted_at": null
//                     },
//                     "created_at": "2024-12-25T05:41:09.008Z",
//                     "updated_at": "2024-12-25T05:41:09.008Z",
//                     "deleted_at": null
//                 }
//             }
//         ],
//         "shipping_address": {
//             "id": "caaddr_01JH27WPECNDJPE77QYXQRDT8J",
//             "customer_id": null,
//             "company": "sdvdsv",
//             "first_name": "dvsvdsv",
//             "last_name": "sdvsdv",
//             "address_1": "sdvsdv",
//             "address_2": "",
//             "city": "dsvsdv",
//             "country_code": "fr",
//             "province": "",
//             "postal_code": "sdvdsv",
//             "phone": "",
//             "metadata": null,
//             "created_at": "2025-01-08T05:58:38.798Z",
//             "updated_at": "2025-01-08T05:58:38.798Z"
//         },
//         "billing_address": {
//             "id": "caaddr_01JH27WPEC8H8QMZY2E7Q41HJV",
//             "customer_id": null,
//             "company": "sdvdsv",
//             "first_name": "dvsvdsv",
//             "last_name": "sdvsdv",
//             "address_1": "sdvsdv",
//             "address_2": "",
//             "city": "dsvsdv",
//             "country_code": "fr",
//             "province": "",
//             "postal_code": "sdvdsv",
//             "phone": "",
//             "metadata": null,
//             "created_at": "2025-01-08T05:58:38.797Z",
//             "updated_at": "2025-01-08T05:58:38.797Z"
//         },
//         "shipping_methods": [
//             {
//                 "id": "ordsm_01JH27XJ1J3JWJ5BR9XSFW5228",
//                 "name": "Standard Shipping",
//                 "description": null,
//                 "raw_amount": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "is_tax_inclusive": false,
//                 "is_custom_amount": false,
//                 "shipping_option_id": "so_01JFY5AK2VA4J3K6FNEDAAT4YS",
//                 "data": {},
//                 "metadata": null,
//                 "created_at": "2025-01-08T05:59:07.062Z",
//                 "updated_at": "2025-01-08T05:59:07.062Z",
//                 "deleted_at": null,
//                 "tax_lines": [],
//                 "adjustments": [],
//                 "amount": 10,
//                 "order_id": "order_01JH27XJ1J2V07M2B2V8MB6TWM",
//                 "detail": {
//                     "id": "ordspmv_01JH27XJ1J4STG71Y68XYF61FY",
//                     "order_id": "order_01JH27XJ1J2V07M2B2V8MB6TWM",
//                     "version": 1,
//                     "shipping_method_id": "ordsm_01JH27XJ1J3JWJ5BR9XSFW5228",
//                     "created_at": "2025-01-08T05:59:07.063Z",
//                     "updated_at": "2025-01-08T05:59:07.063Z",
//                     "deleted_at": null
//                 },
//                 "subtotal": 10,
//                 "total": 10,
//                 "original_total": 10,
//                 "discount_total": 0,
//                 "discount_subtotal": 0,
//                 "discount_tax_total": 0,
//                 "tax_total": 0,
//                 "original_tax_total": 0,
//                 "raw_subtotal": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_total": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_original_total": {
//                     "value": "10",
//                     "precision": 20
//                 },
//                 "raw_discount_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_discount_subtotal": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_discount_tax_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_tax_total": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_original_tax_total": {
//                     "value": "0",
//                     "precision": 20
//                 }
//             }
//         ],
//         "payment_collections": [
//             {
//                 "id": "pay_col_01JH27WW5VDZ9Y2BYM0H16ABTM",
//                 "currency_code": "eur",
//                 "region_id": "reg_01JFY5AJZRMXAP0NS1JXT8GATB",
//                 "completed_at": null,
//                 "status": "authorized",
//                 "metadata": null,
//                 "raw_amount": {
//                     "value": "20",
//                     "precision": 20
//                 },
//                 "raw_authorized_amount": {
//                     "value": "20",
//                     "precision": 20
//                 },
//                 "raw_captured_amount": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "raw_refunded_amount": {
//                     "value": "0",
//                     "precision": 20
//                 },
//                 "created_at": "2025-01-08T05:58:44.667Z",
//                 "updated_at": "2025-01-08T05:59:07.027Z",
//                 "deleted_at": null,
//                 "amount": 20,
//                 "authorized_amount": 20,
//                 "captured_amount": 0,
//                 "refunded_amount": 0
//             }
//         ]
//     }
// }

