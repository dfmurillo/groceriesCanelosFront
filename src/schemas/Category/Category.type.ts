import { z } from "zod";
import { categoryCreateSchema, categorySchema } from "./Category.schema";

export type CategoryType = z.infer<typeof categorySchema>
export type CategoryCreateType = z.infer<typeof categoryCreateSchema>