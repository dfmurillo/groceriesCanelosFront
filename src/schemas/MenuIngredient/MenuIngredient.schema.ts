import { z } from "zod";
import { ingredientSchema } from "../Ingredient/Ingredient.schema";

export const menuIngredientSchema = z.object({
  id: z.number(),
  ingredientQuantity: z.number().min(1),
  ingredientQuantityType: z.string(),
  ingredient: ingredientSchema
})

export const menuIngredientFormCreateSchema = z.object({
  ingredientQuantity: z.number(),
  ingredientQuantityType: z.string().min(1),
  ingredient: z.number(),
  _name: z.string().optional()
})

export const menuIngredientCreateSchema = z.object({
  ingredientQuantity: z.number().min(1),
  ingredientQuantityType: z.string(),
  ingredient: z.number(),
  menu: z.number()
}).array()

export const menuIngredientCreateResponseSchema = z.object({
  ingredientQuantity: z.number().min(1),
  ingredientQuantityType: z.string(),
  ingredient: z.object({
    id: z.number()
  }),
  menu: z.object({
    id: z.number()
  }),
}).array()

export const menuIngredientListCreateSchema = z.array(menuIngredientFormCreateSchema)