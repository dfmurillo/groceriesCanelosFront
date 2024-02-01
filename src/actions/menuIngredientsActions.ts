import axios from "axios"
import { menuIngredientCreateResponseSchema } from "@/schemas/MenuIngredient/MenuIngredient.schema"
import { MenuIngredientCreateResponseType, MenuIngredientCreateType } from "@/schemas/MenuIngredient/MenuIngredient.type"
import { validateSchema } from "@/utils/validateSchema"
import { env } from "env.mjs"

export async function createMenuIngredients(menuIngredientsDto: MenuIngredientCreateType) {
  try {
    const { data } = await axios.post<MenuIngredientCreateResponseType>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menu-ingredients/`, menuIngredientsDto)
    if (!validateSchema<MenuIngredientCreateResponseType>(data, menuIngredientCreateResponseSchema)) {
      console.log(`DFM_ ln: 11 __ createMenuIngredients`, data)
      throw new Error('Invalid menu ingredients list data')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}