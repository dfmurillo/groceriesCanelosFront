import { z } from 'zod'
import { tagSchema } from '../Tag/Tag.schema'

export const ingredientTagsSchema = z.object({
  id: z.number(),
  tag: tagSchema.optional(),
})

export const ingredientTagsCreateSchema = z.object({
  tagId: z.number(),
  ingredientId: z.number(),
})

export const ingredientTagsCreateResponseSchema = z.object({
  id: z.number(),
  ingredient: z.object({ id: z.number() }),
  tag: z.object({ id: z.number() }),
})
