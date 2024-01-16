'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import FilterList from '@/components/Filter/FilterList'
import { getCategoriesTags } from '@/server/categoryActions'

const CategoryFilter = () => {
  const {
    data: categoryFilters,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesTags,
  })

  if (isLoading) return <span className='loading loading-dots loading-md'></span>
  if (error) return <pre>Error: {error.message}</pre>
  if (!categoryFilters) return <></>

  return categoryFilters.map((filterData) => <FilterList key={filterData.id} filterData={filterData} />)
}

export default CategoryFilter
