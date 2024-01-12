'use client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getCategoriesTags } from '@/server/categoryActions'
import CategoriesRow from './CategoriesRow'
import AlertBanner from '../Alert/AlertBanner'
import { AlertBannerTypeEnum } from '../Alert/AlertBanner.type'

const CategoriesTable = () => {
  const {
    data: categoryFilters,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesTags,
  })

  if (isLoading) return <span className='loading loading-dots loading-md'></span>
  if (error) return <AlertBanner alertType={AlertBannerTypeEnum.ERROR} message={error.message} />

  return (
    <div className='flex flex-row flex-wrap'>
      <div className='w-full overflow-x-auto'>
        <table className='table table-zebra'>
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Category</th>
              <th>Tags</th>
              <th></th>
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
