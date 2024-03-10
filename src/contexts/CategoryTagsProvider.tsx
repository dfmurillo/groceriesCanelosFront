'use client'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'
import { CategoryType } from '@/schemas/Category/Category.type'

type CategoryTagsProviderPropsType = {
  children: ReactNode
}

type CategoryTagsContextType = {
  categoryTags: CategoryType[]
  setCategoryTags: Dispatch<SetStateAction<CategoryType[]>>
}

const CategoryTagsContext = createContext<CategoryTagsContextType | null>(null)

const CategoryTagsProvider = ({ children }: CategoryTagsProviderPropsType) => {
  const defaultCategoryTags = [] as CategoryType[]
  const [categoryTags, setCategoryTags] = useState<CategoryType[]>(defaultCategoryTags)
  return (
    <CategoryTagsContext.Provider value={{ categoryTags, setCategoryTags }}>{children}</CategoryTagsContext.Provider>
  )
}

export function useCategoryTagsContext() {
  const context = useContext(CategoryTagsContext)
  if (!context) throw new Error('useCategoryTagsContext must be within the provider')

  return context
}

export default CategoryTagsProvider
