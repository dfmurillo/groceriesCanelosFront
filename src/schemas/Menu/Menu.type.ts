import { z } from "zod";
import { menuCreateResponseSchema, menuCreateSchema, menuFormCreateSchema, menuSchema, menuWithIngredientsSchema } from "./Menu.schema";

export type MenuType = z.infer<typeof menuSchema>
export type MenuCreateType = z.infer<typeof menuCreateSchema>
export type MenuCreateResponseType = z.infer<typeof menuCreateResponseSchema>
export type MenuWithIngredientsType = z.infer<typeof menuWithIngredientsSchema>
export type MenuFormCreateType = z.infer<typeof menuFormCreateSchema>