import axios from 'axios'
import { ingredientTagsCreateResponseSchema } from '@/schemas/IngredientTag/IngredientTag.schema'
import { IngredientTagsCreateResponseType, IngredientTagsCreateType, IngredientTagsType } from '@/schemas/IngredientTag/IngredientTag.type'
import { validateSchema } from '@/utils/validateSchema'
import { env } from 'env.mjs'

export async function createIngredientTag({ingredientId, tagId}: IngredientTagsCreateType): Promise<IngredientTagsCreateResponseType> {
  try {
    const { data } = await axios.post<IngredientTagsType>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredient-tags/`, { ingredient: ingredientId, tag: tagId })

    if (!validateSchema<IngredientTagsCreateResponseType>(data, ingredientTagsCreateResponseSchema)) {
      throw new Error('error with response structure on createIngredientTag')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function deleteIngredientTag(id: number): Promise<void> {
  try {
    await axios.delete(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredient-tags/${id}`)
  } catch (error) {
    throw new Error((error as Error).message)
  }
}