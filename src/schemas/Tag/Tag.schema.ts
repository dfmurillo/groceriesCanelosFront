import { z } from 'zod'

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const tagCreateSchema = z.object({
  name: z.string().min(1, { message: 'Tag name is required' }),
  categoryId: z.number(),
})
