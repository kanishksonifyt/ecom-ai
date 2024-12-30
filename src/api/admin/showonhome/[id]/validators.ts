import { z } from "zod"

export const PostAdminCreateShowonhome = z.object({
    product_id: z.string(),
})