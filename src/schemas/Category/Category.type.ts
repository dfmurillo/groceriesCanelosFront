import { z } from "zod";
import { categoryCreateSchema, categorySchema, categoryUpdateSchema } from "./Category.schema";

export type CategoryType = z.infer<typeof categorySchema>
export type CategoryCreateType = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateType = z.infer<typeof categoryUpdateSchema>