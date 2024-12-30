
import { z } from "zod";

// Validators
export const PostAdminCreateReview = z.object({
    id: z.string().optional(),
    rating: z.number().min(0).max(5),
    title: z.string(),
    description: z.string().optional(),
    user_name: z.string(),
    date: z.string(),
  });
  
  export const PatchAdminEditReview = z.object({
    rating: z.number().min(0).max(5).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    user_name: z.string().optional(),
    date: z.string().optional(),
  });
  