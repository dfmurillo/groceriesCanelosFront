import { z } from 'zod'
import {
  ingredientTagsCreateResponseSchema,
  ingredientTagsCreateSchema,
  ingredientTagsSchema,
} from './IngredientTag.schema'

export type IngredientTagsType = z.infer<typeof ingredientTagsSchema>
export type IngredientTagsCreateType = z.infer<typeof ingredientTagsCreateSchema>
export type IngredientTagsCreateResponseType = z.infer<typeof ingredientTagsCreateResponseSchema>
