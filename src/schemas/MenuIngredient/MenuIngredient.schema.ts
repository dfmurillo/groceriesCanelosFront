import { z } from "zod";
import { ingredientSchema } from "../Ingredient/Ingredient.schema";

export const menuIngredientSchema = z.object({
  id: z.number(),
  ingredientQuantity: z.number(),
  ingredientQuantityType: z.string(),
  ingredient: ingredientSchema
})

export const menuIngredientFormCreateSchema = z.object({
  ingredientQuantity: z.number(),
  ingredientQuantityType: z.string().min(1),
  ingredient: z.number(),
  _name: z.string(),
  _id: z.number().nullable()
})

export const menuIngredientCreateSchema = z.object({
  ingredientQuantity: z.number(),
  ingredientQuantityType: z.string(),
  ingredient: z.number(),
  menu: z.number()
})

export const menuIngredientUpdateSchema = z.object({
  id: z.number(),
  ingredientQuantity: z.number(),
  ingredientQuantityType: z.string()
})

export const menuIngredientCreateResponseSchema = z.object({
  ingredientQuantity: z.number(),
  ingredientQuantityType: z.string(),
  ingredient: z.object({
    id: z.number()
  }),
  menu: z.object({
    id: z.number()
  }),
}).array()

export const menuIngredientUpdateResponseSchema = z.object({
  id: z.number(),
  ingredientQuantity: z.number().optional(),
  ingredientQuantityType: z.string().optional()
})

export const menuIngredientListFormCreateSchema = z.array(menuIngredientFormCreateSchema)