import { z } from "zod";
import { menuIngredientCreateResponseSchema, menuIngredientCreateSchema } from "./MenuIngredient.schema";

export type MenuIngredientCreateType = z.infer<typeof menuIngredientCreateSchema>
export type MenuIngredientCreateResponseType = z.infer<typeof menuIngredientCreateResponseSchema>