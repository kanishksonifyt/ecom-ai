import { z } from "zod";

// POST Validator
export const createPointValidator = z.object({
  coins: z.string(),
  relatedto: z.string(),
  owner_id: z.string(),
});

// PUT Validator
export const updatePointValidator = z.object({
  coins: z.number().optional(),
  relatedto: z.string().optional(),
  owner_id: z.string().optional(),
});
