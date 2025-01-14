import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getAllFeaturedsWorkflow } from "../../../workflows/create-featured";
import { getAllcatalogfeaturedsWorkflow } from "../../../workflows/create-catalogfeatured";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getAllFeaturedsWorkflow(req.scope).run();
  const { result: catalogresult } = await getAllcatalogfeaturedsWorkflow(req.scope).run();

  // Merging result where type is "catalog" by adding all catalogresult data
  const mergedResult = result.map((item: any) => {
    if (item.type === "catalog") {
      // Merging item with all catalog data when type is "catalog"
      return { ...item, catalogData: catalogresult };
    }
    return item;
  });

  res.json({ featureds: mergedResult });
};

