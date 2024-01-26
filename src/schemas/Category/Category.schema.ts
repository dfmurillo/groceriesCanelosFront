import { z } from 'zod'
import { tagSchema } from '../Tag/Tag.schema'

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryTags: z.array(tagSchema).optional(),
})

export const categoryCreateSchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
})

export const categoryUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'Category name is required' }),
})

export const categoryGetResponseSchema = z.array(categorySchema)
