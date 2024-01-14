import { z } from 'zod'
import { tagSchema } from '../Tag/Tag.schema'

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryTags: z.array(tagSchema).optional(),
})

export const categoryCreateSchema = z.object({
  name: z.string(),
})

export const categoryUpdateSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const categoryGetResponseSchema = z.array(categorySchema)
