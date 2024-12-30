import { z } from "zod"

export const PostAdminCreateFeatured = z.object({
  link: z.string(),
  image: z.string(),
  title : z.string(),
  text : z.string(),
})

export const PatchAdminCreateFeatured = z.object({
    link: z.string(),
    id : z.string().optional(),
    image: z.string(),
    title : z.string(),
    text : z.string(),
  })