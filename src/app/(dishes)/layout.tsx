import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import HeaderMenu from '@/components/HeaderMenu/HeaderMenu'
import FilterContextProvider from '@/components/Providers/FilterContextProvider'
import Header from '@/containers/Header'
import AddMenu from '@/features/Menu/MenuAddButton'
import { getCategoriesTags } from '@/server/categoryActions'

const DishesLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesTags,
  })

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
