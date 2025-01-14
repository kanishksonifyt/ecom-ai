import { z } from "zod"

export const PostAdminCreateHighlight = z.object({
    id : z.string().optional(),
    image: z.string().optional(),
    link: z.string().optional(),
    product_id : z.string().optional(),
})

export const PatchAdminEditHero = z.object({
    link: z.string().optional(),
    image: z.string().optional(),
    product_id : z.string().optional(),
    type : z.string().optional(),
});