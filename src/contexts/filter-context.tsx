'use client'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { FilterCategoryType } from '@/components/Filter/Filter.type'

type FilterContextProviderPropsType = {
  children: React.ReactNode
}

type FilterContextType = {
  filter: FilterCategoryType
  setFilter: Dispatch<SetStateAction<FilterCategoryType>>
}

const FilterContext = createContext<FilterContextType | null>(null)

export default function FilterContextProvider({ children }: FilterContextProviderPropsType) {
  const initFilters = {} as FilterCategoryType
  const [filter, setFilter] = useState<FilterCategoryType>(initFilters)

  return (
    <FilterContext.Provider
      value={{
        filter,
        setFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilterContext must be within the provider')
  }

  return context
}
