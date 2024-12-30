import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { 
    createCatalogWorkflow,
    getAllCatalogsWorkflow
  } from "../../../workflows/create-catalog"

import { z } from "zod"
import { PostAdminCreateCatalog } from "./validators"

type PostAdminCreateCatalogType = z.infer<typeof PostAdminCreateCatalog>


  
  type PostAdminCreateBrandType = {
    link : string;
    image: string;
  }
  
  export const POST = async (
    req: MedusaRequest<PostAdminCreateCatalogType>,
    res: MedusaResponse
  ) => {
    const { result } = await createCatalogWorkflow(req.scope)
      .run({
        input: req.validatedBody,
      })
  
    res.json({ catalog: result })
  }


    export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
        const { result } = await getAllCatalogsWorkflow(req.scope)
        .run()
    
        res.json({ catalogs: result })
    }
