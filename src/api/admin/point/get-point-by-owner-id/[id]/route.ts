import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getPointByIdWorkflow } from "../../../../../workflows/create-point";

// export default async function getByOwnerIdRoute(
//   req: MedusaRequest,
//   res: MedusaResponse
// ) {
//   try {
//     const {id} = req.params;

//     if (!id) {
//       return res.status(400).json({ error: "Owner ID is required" });
//     }

//     // Correctly pass input as an object
//     const points = getPointByIdWorkflow({ input: { owner_id :  id } });
//     res.status(200).json(points);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
