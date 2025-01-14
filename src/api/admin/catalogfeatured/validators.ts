import { z } from "zod"

export const PostAdminCreateCatalog = z.object({
  link: z.string(),
  image: z.string(),
})

export const PatchAdminCreateCatalog = z.object({
    link: z.string(),
    id : z.string().optional(),
    image: z.string(),
  })