import axios from "axios";
import { menuCreateResponseSchema, menuSchema } from "@/schemas/Menu/Menu.schema";
import { MenuCreateResponseType, MenuCreateType, MenuType, MenuUpdateType } from "@/schemas/Menu/Menu.type";
import { validateSchema } from "@/utils/validateSchema";
import { env } from "env.mjs";

export async function createMenu(menuDto: MenuCreateType) {
  try {
    const { data } = await axios.post<MenuCreateResponseType>(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/`, menuDto)
    if (!validateSchema<MenuCreateResponseType>(data, menuCreateResponseSchema)) {
      throw new Error('Invalid Created Menu data')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function updateMenu({ id, ...updatedMenu }: MenuUpdateType) {
  try {
    const { data } = await axios.patch(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/${id}`, updatedMenu)
    if (!validateSchema<MenuType>(data, menuSchema)) {
      throw new Error('error with response structure while updating the menu')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export async function deleteMenu(id: number): Promise<void> {
  try {
    await axios.delete(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/${id}`)
  } catch (error) {
    throw new Error((error as Error).message)
  }
}