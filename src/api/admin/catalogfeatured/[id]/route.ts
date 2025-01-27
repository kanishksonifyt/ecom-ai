import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  editcaCaloghightlightWorkflow,
  deletecatalogfeaturedWorkflow,
} from "../../../../workflows/create-catalogfeatured";

import { z } from "zod";
import { PatchAdminCreateCatalog } from "../validators";

type PatchAdminCreateCatalogType = z.infer<typeof PatchAdminCreateCatalog>;

export const PATCH = async (
  req: MedusaRequest<PatchAdminCreateCatalogType>,
  res: MedusaResponse
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Catalog ID is required" });
  }

  try {
    const { body } = req;

    // Validate the request body
    const parsedBody = PatchAdminCreateCatalog.parse(body);

    // Run the edit workflow
    const updatedCatalog = await editcaCaloghightlightWorkflow(req.scope).run({
      input: { id, ...parsedBody },
    });

    return res.status(200).json({ catalog: updatedCatalog });
  } catch (error) {
    console.error("Error editing catalog:", error);
    return res.status(500).json({ message: "Failed to update catalog", error });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Catalog ID is required" });
  }

  try {
    // Run the delete workflow
    await deletecatalogfeaturedWorkflow(req.scope).run({ input: { id } });

    return res.status(204).send({
      message: `Catalog with ID ${id} was successfully deleted`,
    });
  } catch (error) {
    console.error("Error deleting catalog:", error);
    return res.status(500).json({ message: "Failed to delete catalog", error });
  }
};
