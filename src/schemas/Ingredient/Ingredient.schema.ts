import { z } from 'zod'
import { ingredientTagsSchema } from '../IngredientTag/IngredientTag.schema'

export const ingredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  ingredientTags: z.array(ingredientTagsSchema),
})

export const ingredientCreateSchema = z.object({
  name: z.string(),
})

export const ingredientEditSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const ingredientGetResponseSchema = z.array(ingredientSchema)
