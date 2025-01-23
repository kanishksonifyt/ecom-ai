import { Modules } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteLink } from "@medusajs/framework/modules-sdk";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {


    // Use container to resolve the PRODUCT module
    const productService = req.scope.resolve(Modules.PROMOTION);

    // Retrieve the product along with its categories
    const product = await productService.listPromotions(
      {},
      {
        relations: ["application_method.target_rules.*"],
      }
    );
     const remoteLink: RemoteLink = req.scope.resolve(
        ContainerRegistrationKeys.REMOTE_LINK
      );
    
      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: promotion } = await query.graph({
        entity: "promotion",
        fields: ["application_method.type","application_method.value" ,"application_method.target_rules.*","application_method.target_rules.values.value"],
        
      });
    

    // Send categories in response
    res.json({  promotion });
  } catch (error) {
    console.error("Error in GET handler:", error);
    res.status(500).json({ error: "Failed to retrieve product categories" });
  }
};
