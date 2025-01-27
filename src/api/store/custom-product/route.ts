import { Modules } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteLink } from "@medusajs/framework/modules-sdk";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Use container to resolve the PRODUCT module
    const productService = req.scope.resolve(Modules.PRODUCT);
    const priceService = req.scope.resolve(Modules.PRICING);


    const remoteLink: RemoteLink = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: promotion } = (await query.graph({
      entity: "promotion",
      fields: [
        "application_method.type",
        "application_method.value",
        "application_method.target_rules.*",
        "application_method.target_rules.values.value",
      ],
    })) as any;

    // promotion : promotion[0].application_method
    // promotion.application_method[0]

    // Retrieve the product along with its categories
    const product = await productService.listProducts(
      {},
      {
        relations: ["categories", "collection" , "images" , "variants.*" , "variants.options.*" ],
      }
    );


    // const product2 = await productService


    // const { data: product } = (await query.graph({
    //   entity: "product",
    //   fields: [
    //    "item.product.title"
    //   ],
    // })) as any;
    

    // Extract categories

    // Function to map target rule value with product id and add discountable flag
    function applyDiscountToProduct(targetRules, products) {
      // Extract the discount value from target rules
      const discountValue = targetRules.value;
  
      // Loop through each product and check if its id matches any target value
      products.forEach((product) => {
          targetRules.target_rules[0].values.forEach((rule) => {
              if (product.id === rule.value) {
                  // Ensure product metadata exists and create the discount field if it doesn't
                  if (!product.metadata) {
                      product.metadata = {}; // Create an empty metadata object if it doesn't exist
                  }
                  if (!product.metadata.discount) {
                      product.metadata.discount = 0; // Set the default discount value if not present
                  }
  
                  // Apply the discount to the product's metadata
                  product.metadata.discount = discountValue;
                  product.discountable = true; // Ensure the product is marked as discountable
                  console.log(`Discount applied to product: ${product.title}`);
              }
          });
      });
  
      return products;
  }

    // Apply discount based on target rules
    const updatedProducts = applyDiscountToProduct(promotion[0].application_method, product);

    // Send categories in response
    res.json({ updatedProducts  });
  } catch (error) {
    console.error("Error in GET handler:", error);
    res.status(500).json({ error: "Failed to retrieve product categories" });
  }
};
