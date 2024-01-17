import axios from 'axios'
import { categoryGetResponseSchema, categorySchema } from '@/schemas/Category/Category.schema'
import { CategoryCreateType, CategoryType, CategoryUpdateType } from '@/schemas/Category/Category.type'
import { validateSchema } from '@/utils/validateSchema'
import { env } from 'env.mjs'

export async function getCategoriesTags(): Promise<CategoryType[]> {
  try {
    const { data } = await axios.get<CategoryType[]>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/`)
    if (!validateSchema<CategoryType[]>(data, categoryGetResponseSchema)) {
      throw new Error('error with response structure on getCategoriesTags')
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
    if (!validateSchema<CategoryType>(data, categorySchema)) {
      throw new Error('error with response structure on createCategory')
    }

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function updateCategory({ name, id }: CategoryUpdateType): Promise<CategoryType> {
  try {
    const { data } = await axios.patch(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/${id}`, { name })
    if (!validateSchema<CategoryType>(data, categorySchema)) {
      throw new Error('error with response structure on updateCategory')
    }

    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
