// getAllShowonHomeWorkflow

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
    getAllShowonHomeWorkflow
} from "../../../workflows/create-showonhome";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { result } = await getAllShowonHomeWorkflow(req.scope)
    .run()
    res.json({ showonhome: result })
}
