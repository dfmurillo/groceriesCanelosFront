import React from 'react'
import Header from '@/containers/Header'
import AddMenu from '@/features/Menu/MenuAddButton'

const MenusLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <>
      <Header pageTitle='Menus'>
        <AddMenu />
      </Header>
      {children}
    </>
  )
}

export default MenusLayout