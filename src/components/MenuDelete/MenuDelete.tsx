'use client'
import React, { useRef } from 'react'
import { deleteMenu } from '@/actions/menuActions'
import revalidateData from '@/app/actions'
import AlertDelete, { AlertDeleteFunctionsType } from '../UI/Alert/AlertDelete'
import Button from '../UI/FormElements/Button'

type MenuDeletePropsType = {
  id: number
}

const MenuDelete = ({ id }: MenuDeletePropsType) => {
  const alertDeleteRef = useRef<AlertDeleteFunctionsType>(null)

  const handleDeleteConfirmation = () => {
    alertDeleteRef.current?.setVisibility(true)
  }
  const handleDeleteMenu = async () => {
    await deleteMenu(id)
    alertDeleteRef.current?.setVisibility(false)
    revalidateData('menus')
  }
  return (
    <>
      <Button
        action={'delete'}
        label='Delete'
        size={'xs'}
        buttonProps={{ type: 'button', onClick: handleDeleteConfirmation }}
      />
      <AlertDelete ref={alertDeleteRef} alertText='Are you sure?' handleAction={handleDeleteMenu} />
    </>
  )
}

export default MenuDelete
