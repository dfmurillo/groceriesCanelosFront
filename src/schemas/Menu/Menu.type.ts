import { z } from "zod";
import { menuCreateResponseSchema, menuCreateSchema, menuFormSchema, menuSchema, menuUpdateSchema, menuWithIngredientsSchema } from "./Menu.schema";

export type MenuType = z.infer<typeof menuSchema>
export type MenuCreateType = z.infer<typeof menuCreateSchema>
export type MenuUpdateType = z.infer<typeof menuUpdateSchema>
export type MenuCreateResponseType = z.infer<typeof menuCreateResponseSchema>
export type MenuWithIngredientsType = z.infer<typeof menuWithIngredientsSchema>
export type MenuFormType = z.infer<typeof menuFormSchema>