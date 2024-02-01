import { Metadata } from 'next'
import React from 'react'
import { env } from 'process'
import ActionButton from '@/components/Categories/ActionButton'
import MenuCreateForm from '@/components/MenuCreate/MenuCreateForm'
import MenuTile from '@/components/MenuGrid/MenuTile'
import { menuResponseSchema } from '@/schemas/Menu/Menu.schema'
import { MenuWithIngredientsType } from '@/schemas/Menu/Menu.type'
import { validateSchema } from '@/utils/validateSchema'

export const metadata: Metadata = {
  title: 'Menus',
}

async function getData() {
  const res = await fetch(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/`, { next: { tags: ['menus'] } })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

const MenusPage = async () => {
  const menus = await getData()
  if (!validateSchema<MenuWithIngredientsType[]>(menus, menuResponseSchema)) {
    throw new Error('Invalid Menus data')
  }

  return (
    <>
      <ActionButton textButton='New Menu' buttonPrefixIcon='+'>
        <MenuCreateForm />
      </ActionButton>
      <div className='mb-32 mt-7 grid h-full w-full grid-cols-1 place-items-center content-around gap-y-5 md:grid-cols-2 lg:grid-cols-3'>
        {menus.map((menu) => (
          <MenuTile key={menu.id} menu={menu} />
        ))}
      </div>
    </>
  )
}

export default MenusPage
