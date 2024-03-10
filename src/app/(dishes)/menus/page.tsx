import { Metadata } from 'next'
import React from 'react'
import { env } from 'process'
import revalidateData from '@/app/actions'
import ActionButton from '@/components/Categories/ActionButton'
import MenuCreateEditForm from '@/components/MenuCreateEdit/MenuCreateEditForm'
import MenuTile from '@/components/MenuGrid/MenuTile'
import DataList from '@/components/UI/FormElements/DataList'
import { menuResponseSchema } from '@/schemas/Menu/Menu.schema'
import { MenuWithIngredientsType } from '@/schemas/Menu/Menu.type'
import { _INGREDIENT_QUANTITY_TYPE_DATA_LIST_ID } from '@/utils/constants'
import { validateSchema } from '@/utils/validateSchema'

export const metadata: Metadata = {
  title: 'Menus',
}

async function _getData() {
  const res = await fetch(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/`, { next: { tags: ['menus'] } })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

const MenusPage = async () => {
  revalidateData('menus')
  const menus = await _getData()
  if (!validateSchema<MenuWithIngredientsType[]>(menus, menuResponseSchema)) {
    throw new Error('Invalid Menus data')
  }

  const ingredientQuantityTypeList = menus
    ?.map((menu) => {
      const menuIngredients = menu.menuIngredient || []
      return menuIngredients.map(({ ingredientQuantityType }) => ingredientQuantityType).flat()
    })
    .flat()

  return (
    <>
      <ActionButton textButton='New Menu' buttonPrefixIcon='+'>
        <MenuCreateEditForm />
      </ActionButton>
      <div className='mb-32 mt-7 grid h-full w-full grid-cols-1 justify-around gap-y-5 md:grid-cols-2 lg:grid-cols-3'>
        {menus.map((menu) => (
          <MenuTile key={menu.id} menu={menu} />
        ))}
      </div>
      <DataList
        dataListProps={{
          id: _INGREDIENT_QUANTITY_TYPE_DATA_LIST_ID,
        }}
        listOptions={[...new Set(ingredientQuantityTypeList)]}
      />
    </>
  )
}

export default MenusPage
