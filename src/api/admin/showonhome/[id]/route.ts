import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  deleteShowonHomeWorkflow,
  createShowonHomeWorkflow,
} from "../../../../workflows/create-showonhome";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { RemoteLink } from "@medusajs/framework/modules-sdk";
import { z } from "zod";
import { PostAdminCreateShowonhome } from "./validators";
import { ITEM_MODULE } from "../../../../modules/item";




type PostAdminCreateShowonhomeType = {
  product_id: string;
};

// ...

export const POST = async (
  req: MedusaRequest<PostAdminCreateShowonhomeType>,
  res: MedusaResponse
) => {
  const { id: product_id } = req.params;

  const remoteLink: RemoteLink = req.scope.resolve(
    ContainerRegistrationKeys.REMOTE_LINK
  );

  console.log("route hit", product_id);
  const { result } = await createShowonHomeWorkflow(req.scope).run({
    input: { product_id, show_on_homepage: true },
  });

  if (product_id) {
    await remoteLink.create({
      [Modules.PRODUCT]: {
        product_id: product_id,
      },
      [ITEM_MODULE]: {
        item_id: result.id,
      },
    });
  }

  res.json({ Show_on_home: result });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params;
    console.log("route hit", id);
    await deleteShowonHomeWorkflow(req.scope).run({ input: { id } });

    res.status(204).send({
      msg: ` was deleted suc`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
