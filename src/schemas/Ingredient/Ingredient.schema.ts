import { z } from 'zod'
import { ingredientTagsSchema } from '../IngredientTag/IngredientTag.schema'

export const ingredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  ingredientTags: z.array(ingredientTagsSchema).optional(),
})

export const ingredientCreateSchema = z.object({
  name: z.string().min(1, { message: 'Ingredient name is required' }),
})

export const ingredientUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: 'Ingredient name is required' }),
})

export const ingredientResponseListSchema = z.array(ingredientSchema)
