import { z } from "zod";
import { categoryFilterSchema } from "./CategoryFilter.schema";

export type CategoryFilterType = z.infer<typeof categoryFilterSchema>