import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import HeaderMenu from '@/components/HeaderMenu/HeaderMenu'
import Header from '@/containers/Header'
import AddMenu from '@/features/Menu/MenuAddButton'
import { getCategoriesTags } from '@/server/actions'

const DishesLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesTags,
  })

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header pageTitle='Menus'>
          <div className='navbar-end flex space-x-3'>
            <HeaderMenu />
            <AddMenu />
          </div>
        </Header>
        {children}
      </HydrationBoundary>
    </>
  )
}

export default DishesLayout
