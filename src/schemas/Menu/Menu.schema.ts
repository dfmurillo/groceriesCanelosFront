import { z } from "zod";
import { menuIngredientListFormCreateSchema, menuIngredientSchema } from "../MenuIngredient/MenuIngredient.schema";

export const menuSchema = z.object({
  id: z.number(),
  menuPax: z.number().min(1),
  name: z.string(),
  detail: z.string().optional().nullable(),
})

export const menuCreateSchema = z.object({
  menuPax: z.number().min(1),
  name: z.string(),
  detail: z.string().nullable(),
})

export const menuUpdateSchema = z.object({
  id: z.number(),
  menuPax: z.number().min(1).optional(),
  name: z.string().optional(),
  detail: z.string().optional(),
})

export const menuCreateResponseSchema = z.object({
  menuPax: z.number().min(1),
  name: z.string(),
  detail: z.string().nullable(),
  id: z.number(),
  user: z.number()
})

export const menuWithIngredientsSchema = z.object({
  id: z.number(),
  menuPax: z.number().min(1),
  name: z.string(),
  detail: z.string().nullable(),
  menuIngredient: z.array(menuIngredientSchema).nullable(),
})

export const menuFormSchema = z.object({
  name: z.string().min(3, {message: 'The name must contain at least 3 characters'}),
  menuPax: z.number().min(1, { message: 'The menu should be at least for 1 person' }).int(),
  detail: z.string().nullable(),
  ingredients: menuIngredientListFormCreateSchema.optional()
})

export const menuResponseSchema = z.array(menuWithIngredientsSchema)