import { z } from "zod"

export const PostAdminCreateFeatured = z.object({
  link: z.string(),
  image: z.string(),
  title : z.string(),
  type : z.string(),
  text : z.string(),
})

export const PatchAdminCreateFeatured = z.object({
    link: z.string().optional(),
    id : z.string().optional(),
    image: z.string().optional(),
    title : z.string().optional(),
    text : z.string().optional(),
    type : z.string().optional()
  })