import { Metadata } from 'next'
import React from 'react'
import ActionButton from '@/components/Categories/ActionButton'
import CategoriesTable from '@/components/Categories/CategoriesTable'
import NewCategoryForm from '@/components/Categories/NewCategoryForm'

export const metadata: Metadata = {
  title: 'Menus - Settings',
}

const settingsPage = () => {
  return (
    <>
      <section className='border-1 m-2 w-full rounded border-solid border-black bg-slate-50 p-3 shadow-md'>
        <h2>Categories and Tags</h2>
        <ActionButton textButton='New Category' buttonPrefixIcon='+'>
          <NewCategoryForm />
        </ActionButton>
        <CategoriesTable />
      </section>
    </>
  )
}

export default settingsPage
