'use client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import LoadingDots from '@/components/ui/loadingDots'
import { getCategoriesTags } from '@/server/categoryActions'
import CategoriesRow from './CategoriesRow'
import AlertBanner from '../ui/AlertBanner/AlertBanner'
import { AlertBannerTypeEnum } from '../ui/AlertBanner/AlertBanner.type'

const CategoriesTable = () => {
  const {
    data: categoryFilters,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesTags,
  })

  if (isLoading) return <LoadingDots />
  if (error) return <AlertBanner alertType={AlertBannerTypeEnum.ERROR} message={error.message} />

  return (
    <div className='flex flex-row flex-wrap'>
      <div className='w-full overflow-x-auto'>
        <table className='table table-zebra'>
          {/* head */}
          <thead>
            <tr>
              <th>Category</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {categoryFilters?.map((categoryData) => <CategoriesRow key={categoryData.id} {...categoryData} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoriesTable
