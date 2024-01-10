import React from "react"

const AddMenu = () => {
  return (
    <>
      <div className="dropdown dropdown-end ml-4">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <span className="h-6 w-6 text-2xl text-gray-800 dark:text-white">➕</span>
        </label>
        <ul tabIndex={0} className="menu menu-compact dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
          <li className="justify-between">
            <a href="#">Menu</a>
          </li>
          <li className="justify-between">
            <a href="#">Ingredient</a>
          </li>
          <li className="justify-between">
            <a href="#">Meal</a>
          </li>
        </ul>
      </div>
    </>
  )
}

export default AddMenu
