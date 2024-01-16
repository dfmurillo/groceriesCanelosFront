import axios from 'axios'
import { ingredientGetResponseSchema, ingredientSchema } from '@/schemas/Ingredient/Ingredient.schema'
import { IngredientCreateType, IngredientType, IngredientUpdateType } from '@/schemas/Ingredient/Ingredient.type'
import { env } from 'env.mjs'

const isIngredientsWithTags = (result: unknown): result is IngredientType[] => {
  const validResult = ingredientGetResponseSchema.safeParse(result)
  return validResult.success
}

const isIngredientWithTags = (result: unknown): result is IngredientType => {
  const validResult = ingredientSchema.safeParse(result)
  return validResult.success
}

export async function getIngredientsWithTags(): Promise<IngredientType[]> {
  try {
    const { data } = await axios.get<IngredientType[]>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/`)
    if (!isIngredientsWithTags(data)) {
      throw new Error('Wrong ingredients with tags response')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function createIngredient({name}: IngredientCreateType): Promise<IngredientType> {
  try {
    const { data } = await axios.post<IngredientType>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/`, { name })

    if (!isIngredientWithTags(data)) {
      throw new Error('Error saving the ingredient')
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
    if (!isIngredientWithTags(data)) {
      throw new Error('Error updating the ingredient, invalid data')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}