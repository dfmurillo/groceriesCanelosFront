import axios from "axios";
import { menuCreateResponseSchema } from "@/schemas/Menu/Menu.schema";
import { MenuCreateResponseType, MenuCreateType } from "@/schemas/Menu/Menu.type";
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