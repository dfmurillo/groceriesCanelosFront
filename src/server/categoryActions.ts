import axios from 'axios'
import { categoryGetResponseSchema, categorySchema } from '@/schemas/Category/Category.schema'
import { CategoryCreateType, CategoryType, CategoryUpdateType } from '@/schemas/Category/Category.type'
import { env } from 'env.mjs'

const isCategoriesWithTags = (result: unknown): result is CategoryType[] => {
  const validResult = categoryGetResponseSchema.safeParse(result)
  return validResult.success
}

const isCategory = (result: unknown): result is CategoryType => {
  const validResult = categorySchema.safeParse(result)
  return validResult.success
}

export async function getCategoriesTags(): Promise<CategoryType[]> {
  try {
    const { data } = await axios.get<CategoryType[]>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/`)
    if (!isCategoriesWithTags(data)) {
      throw new Error('Wrong Categories with tags response')
    }

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await axios.delete(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/${id}`)
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function createCategory({ name }: CategoryCreateType): Promise<CategoryType> {
  try {
    const { data } = await axios.post(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/`, { name })
    if (!isCategory(data)) {
      throw new Error('Error saving category, invalid data')
    }

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function updateCategory({ name, id }: CategoryUpdateType): Promise<CategoryType> {
  try {
    const { data } = await axios.patch(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/${id}`, { name })
    if (!isCategory(data)) {
      throw new Error('Error updating category, invalid data')
    }

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
