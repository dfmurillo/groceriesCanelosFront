'use client'
import React, { useState } from 'react'
import MenuForm from './MenuForm'

const AddMenu = () => {

  const [isMenuFormOpen, setMenuFormOpen] = useState<boolean>(false)

  const handleMenuAddClick = () => {
    setMenuFormOpen(true)
  }

  const handleCloseMenuModal = () => {
    setMenuFormOpen(false)
  }

  return (
    <>
      <button className="mr-5" onClick={handleMenuAddClick}>
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
        </svg>
      </button>
      <MenuForm isOpen={isMenuFormOpen} onClose={handleCloseMenuModal} />
    </>
  )
}

export default AddMenu