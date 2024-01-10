import axios from "axios"
import { categoryFilterResponseSchema } from "@/schemas/Category/CategoryFilter.schema"
import { CategoryFilterType } from "@/schemas/Category/CategoryFilter.type"
import { env } from "env.mjs"

const isCategoriesWithTags = (result: unknown): result is CategoryFilterType[] => {
  const validResult = categoryFilterResponseSchema.safeParse(result)
  return validResult.success
}

export async function getCategoriesTags(): Promise<CategoryFilterType[]> {
  try { 
    const { data } = await axios.get<CategoryFilterType[]>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/`)
    if (!isCategoriesWithTags(data)) {
      throw new Error('Wrong Categories with tags response')
    }
    
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}