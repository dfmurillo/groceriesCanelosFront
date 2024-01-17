'use client'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getCategoriesTags } from '@/server/categoryActions'
import { getIngredientsWithTags } from '@/server/ingredientActions'
import IngredientTableRow from './IngredientTableRow'
import AlertBanner from '../Alert/AlertBanner'
import { AlertBannerTypeEnum } from '../Alert/AlertBanner.type'
import { useCategoryTagsContext } from '../providers/CategoryTagsProvider'

const IngredientTableBody = () => {
  const { setCategoryTags } = useCategoryTagsContext()
  const {
    data: ingredientsList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredientsWithTags,
  })

  const { data: categoryTags, isSuccess: isSuccessCategoryTags } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesTags,
  })

  useEffect(() => {
    if (isSuccessCategoryTags) setCategoryTags(categoryTags)
  }, [isSuccessCategoryTags, categoryTags, setCategoryTags])

  if (isLoading) return <span className='loading loading-dots loading-md'></span>
  if (error) return <AlertBanner alertType={AlertBannerTypeEnum.ERROR} message={error.message} />

  return ingredientsList?.map((ingredient) => <IngredientTableRow key={ingredient.id} ingredient={ingredient} />)
}

export default IngredientTableBody