import { z } from "zod";
import { ingredientTagsCreateSchema, ingredientTagsSchema } from "./IngredientTag.schema";

export type IngredientTagsType = z.infer<typeof ingredientTagsSchema>
export type IngredientTagsCreateType = z.infer<typeof ingredientTagsCreateSchema>