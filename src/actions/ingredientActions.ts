import axios from 'axios'
import { ingredientGetResponseSchema, ingredientSchema } from '@/schemas/Ingredient/Ingredient.schema'
import { IngredientCreateType, IngredientType, IngredientUpdateType } from '@/schemas/Ingredient/Ingredient.type'
import { validateSchema } from '@/utils/validateSchema'
import { env } from 'env.mjs'

export async function getIngredientsWithTags(): Promise<IngredientType[]> {
  try {
    const { data } = await axios.get<IngredientType[]>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/`)
    if (!validateSchema<IngredientType[]>(data, ingredientGetResponseSchema)) {
      throw new Error('error with response structure on getIngredientsWithTags')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function createIngredient({ name }: IngredientCreateType): Promise<IngredientType> {
  try {
    const { data } = await axios.post<IngredientType>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/`, { name })

    if (!validateSchema<IngredientType>(data, ingredientSchema)) {
      throw new Error('error with response structure on createIngredient')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function deleteIngredient(id: number): Promise<void> {
  try {
    await axios.delete(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/${id}`)
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function updateIngredient({ name, id }: IngredientUpdateType): Promise<IngredientType> {
  try {
    const { data } = await axios.patch(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/${id}`, { name })
    if (!validateSchema<IngredientType>(data, ingredientSchema)) {
      throw new Error('error with response structure on updateIngredient')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
