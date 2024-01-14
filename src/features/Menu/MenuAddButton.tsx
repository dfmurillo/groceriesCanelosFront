import React from 'react'

const AddMenu = () => {
  return (
    <>
      <div className='dropdown dropdown-end ml-4'>
        <label tabIndex={0} className='avatar btn btn-circle btn-ghost'>
          <span className='h-6 w-6 text-2xl text-gray-800 dark:text-white'>➕</span>
        </label>
        <ul tabIndex={0} className='menu-compact menu dropdown-content mt-3 w-52 rounded-box bg-base-100 p-2 shadow'>
          <li className='justify-between'>
            <a href='#'>Menu</a>
          </li>
          <li className='justify-between'>
            <a href='#'>Ingredient</a>
          </li>
          <li className='justify-between'>
            <a href='#'>Meal</a>
          </li>
        </ul>
      </div>
    </>
  )
}

export default AddMenu
