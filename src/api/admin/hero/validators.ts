import { z } from "zod";

export const PostAdminCreateHero = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  firsttext: z.string(),
  secondtext: z.string(),
  image: z.string(),
  index: z.number().optional(),
});


export const PutAdminEditHero = z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    firsttext: z.string().optional(),
    secondtext: z.string().optional(),
    image: z.string().optional(),
});

export const PatchAdminReorderHero = z.object({
  newIndex: z.number(),
});