import { z } from "zod";

export const categoryFilterSchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryTags: z.array(z.object({
    id: z.number(),
    name: z.string()
  }))
})

export const categoryFilterResponseSchema = z.array(categoryFilterSchema)

