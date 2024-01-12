import { z } from "zod";
import { tagCreateSchema, tagSchema } from "./Tag.schema";

export type TagType = z.infer<typeof tagSchema>
export type TagCreateType = z.infer<typeof tagCreateSchema>