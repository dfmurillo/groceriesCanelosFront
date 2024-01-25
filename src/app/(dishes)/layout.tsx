import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import { getCategoriesTags } from '@/actions/categoryActions'
import { getIngredientsWithTags } from '@/actions/ingredientActions'
import HeaderMenu from '@/components/HeaderMenu/HeaderMenu'
import FilterContextProvider from '@/components/Providers/FilterContextProvider'
import Header from '@/containers/Header'
import AddMenu from '@/features/Menu/MenuAddButton'

const DishesLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getCategoriesTags,
    }),
    queryClient.prefetchQuery({
      queryKey: ['ingredients'],
      queryFn: getIngredientsWithTags,
    }),
  ])

  return (
    <>
      <FilterContextProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Header pageTitle='Menus'>
            <div className='navbar-end flex space-x-3'>
              <HeaderMenu />
              <AddMenu />
            </div>
          </Header>
          {children}
        </HydrationBoundary>
      </FilterContextProvider>
    </>
  )
}

export default DishesLayout
