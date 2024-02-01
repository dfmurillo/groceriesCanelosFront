import React from 'react'
import { MenuWithIngredientsType } from '@/schemas/Menu/Menu.type'

type MenuTileType = {
  menu: MenuWithIngredientsType
}

const MenuTile = ({ menu }: MenuTileType) => {
  return (
    <div className='group'>
      <div className='card w-96 bg-base-100 shadow-xl group-hover:bg-neutral group-hover:text-neutral-content'>
        <div className='card-body'>
          <h2 className='center card-title'>
            {menu.name}
            <div className='badge badge-primary'>{menu.menuPax} Pax</div>
          </h2>
          {menu.menuIngredient && (
            <ul>
              {menu.menuIngredient.map(({ id, ingredientQuantity, ingredientQuantityType, ingredient: { name } }) => (
                <li key={id}>
                  {name} - {ingredientQuantity} {ingredientQuantityType}
                </li>
              ))}
            </ul>
          )}
          {menu.detail && (
            <div
              tabIndex={0}
              className='collapse collapse-plus border border-base-300 bg-base-200 group-hover:bg-neutral group-hover:text-neutral-content'
            >
              <div className='collapse-title text-xl font-medium'>Details</div>
              <div className='collapse-content'>
                <p>{menu.detail}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuTile
