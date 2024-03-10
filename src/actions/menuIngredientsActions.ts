import axios from "axios"
import { menuIngredientCreateResponseSchema, menuIngredientUpdateResponseSchema } from "@/schemas/MenuIngredient/MenuIngredient.schema"
import { MenuIngredientCreateResponseType, MenuIngredientCreateType, MenuIngredientUpdateResponseType, MenuIngredientUpdateType } from "@/schemas/MenuIngredient/MenuIngredient.type"
import { validateSchema } from "@/utils/validateSchema"
import { env } from "env.mjs"

export async function createMenuIngredients(menuIngredientsDto: MenuIngredientCreateType[]) {
  try {
    const { data } = await axios.post<MenuIngredientCreateResponseType>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menu-ingredients/`, menuIngredientsDto)
    if (!validateSchema<MenuIngredientCreateResponseType>(data, menuIngredientCreateResponseSchema)) {
      throw new Error('Invalid menu ingredients list data')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function updateMenuIngredients({ id, ...updatedMenuIngredients }: MenuIngredientUpdateType) {
  try {
    const { data } = await axios.patch(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menu-ingredients/${id}`, updatedMenuIngredients)
    if (!validateSchema<MenuIngredientUpdateResponseType>(data, menuIngredientUpdateResponseSchema)) {
      throw new Error('error with response structure while updating the menu ingredients')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function deleteMenuIngredients(id: number): Promise<void> {
  try {
    await axios.delete(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menu-ingredients/${id}`)
  } catch (error) {
    throw new Error((error as Error).message)
  }
}