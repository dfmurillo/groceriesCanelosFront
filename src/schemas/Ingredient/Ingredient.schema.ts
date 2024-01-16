import { z} from 'zod'
import { tagSchema } from '../Tag/Tag.schema'

export const ingredientTagsSchema = z.object({
  id: z.number(),
  tags: tagSchema.optional()
})

export const ingredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  ingredientTags: z.array(ingredientTagsSchema)
})

export const ingredientCreateSchema = z.object({
  name: z.string()
})

export const ingredientEditSchema = z.object({
  id: z.number(),
  name: z.string()
})

export const ingredientGetResponseSchema = z.array(ingredientSchema)
