import { z } from "zod";
import { menuIngredientCreateResponseSchema, menuIngredientCreateSchema, menuIngredientFormCreateSchema, menuIngredientListFormCreateSchema, menuIngredientUpdateResponseSchema, menuIngredientUpdateSchema } from "./MenuIngredient.schema";

export type MenuIngredientListFormCreateType = z.infer<typeof menuIngredientListFormCreateSchema>
export type MenuIngredientCreateResponseType = z.infer<typeof menuIngredientCreateResponseSchema>
export type MenuIngredientUpdateType = z.infer<typeof menuIngredientUpdateSchema>
export type MenuIngredientUpdateResponseType = z.infer<typeof menuIngredientUpdateResponseSchema>
export type MenuIngredientListCreateType = z.infer<typeof menuIngredientFormCreateSchema>
export type MenuIngredientCreateType = z.infer<typeof menuIngredientCreateSchema>