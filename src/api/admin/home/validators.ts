import { z } from "zod";

export const PostAdminCreateHome = z.object({
  id: z.string(),
  title: z.string(),
  index : z.number(),
  route : z.string(),
});


export const PutAdminEditHome = z.object({
    title: z.string().optional(),
    index: z.number().optional(),
    route: z.string().optional(),
    redirect : z.string().optional(),
    text : z.string().optional(),

});

export const PatchAdminReorderHome = z.object({
  newIndex: z.number(),
});