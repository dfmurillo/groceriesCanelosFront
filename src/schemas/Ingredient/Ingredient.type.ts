import { z } from 'zod'
import { ingredientCreateSchema, ingredientSchema, ingredientUpdateSchema } from './Ingredient.schema'

export type IngredientType = z.infer<typeof ingredientSchema>
export type IngredientCreateType = z.infer<typeof ingredientCreateSchema>
export type IngredientUpdateType = z.infer<typeof ingredientUpdateSchema>
