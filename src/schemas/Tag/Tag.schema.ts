import { z } from 'zod'

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const tagCreateSchema = z.object({
  name: z.string(),
  categoryId: z.number(),
})
