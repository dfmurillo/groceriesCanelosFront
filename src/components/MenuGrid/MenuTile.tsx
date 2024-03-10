import React from 'react'
import { MenuWithIngredientsType } from '@/schemas/Menu/Menu.type'
import ActionButton from '../Categories/ActionButton'
import MenuCreateEditForm from '../MenuCreateEdit/MenuCreateEditForm'
import MenuDelete from '../MenuDelete/MenuDelete'

type MenuTileType = {
  menu: MenuWithIngredientsType
}

const MenuTile = ({ menu }: MenuTileType) => {
  return (
    <div className='group'>
      <div className='card w-11/12 bg-base-100 shadow-lg group-hover:border-stone-950 group-hover:shadow-2xl'>
        <div className='card-body'>
          <div className='grid grid-cols-4 place-items-stretch content-evenly items-start justify-items-start align-top'>
            <h2 className='card-title col-span-3 flex-col place-items-start'>
              {menu.name}
              <div className='badge badge-primary'>{menu.menuPax} Pax</div>
            </h2>
            <ActionButton textTitle={`Edit Menu: ${menu.name}`} textButton='Edit Menu' buttonSize={'xs'}>
              <MenuCreateEditForm editMenu={menu} />
            </ActionButton>
          </div>
          {menu.menuIngredient && (
            <ul>
              {menu.menuIngredient.map(({ id, ingredientQuantity, ingredientQuantityType, ingredient: { name } }) => (
                <li key={id} className='capitalize'>
                  {name} - {ingredientQuantity} {ingredientQuantityType}
                </li>
              ))}
            </ul>
          )}
          {menu.detail && (
            <div tabIndex={0} className='collapse collapse-plus bg-base-200'>
              <input type='checkbox' />
              <div className='collapse-title text-xl font-medium'>Details</div>
              <div className='collapse-content'>
                <p>{menu.detail}</p>
              </div>
            </div>
          )}
          <div className='card-actions mt-3 justify-start'>
            <MenuDelete id={menu.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuTile
