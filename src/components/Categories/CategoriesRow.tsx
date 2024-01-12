'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { CategoryType } from '@/schemas/Category/Category.type'
import { TagType } from '@/schemas/Tag/Tag.type'
import { deleteCategory } from '@/server/categoryActions'
import ActionButton from './ActionButton'
import CategoriesTagBadge from './CategoriesTagBadge'
import NewTagForm from './NewTagForm'
import AlertDelete from '../Alert/AlertDelete'

export const CategoriesTagsBadges = () => {}

const CategoriesRow = ({ id, name, categoryTags }: CategoryType) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const queryClient = useQueryClient()
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data, categoryId) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) =>
        oldCategories.filter(({ id }) => categoryId !== id)
      )
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
    },
  })

  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate(id)
  }

  return (
    <tr>
      <td>
        <button onClick={() => setShowDeleteAlert(true)} className='btn btn-warning btn-xs m-4'>
          x Delete Category
        </button>
        {showDeleteAlert && (
          <AlertDelete
            alertText='Deleting the Category will delete all related tags, are you sure?'
            handleDeleteAction={handleDeleteCategory}
            setShowDeleteAlert={setShowDeleteAlert}
          />
        )}
      </td>
      <td>{name}</td>
      <td>
        {categoryTags?.map((categoryTag) => (
          <CategoriesTagBadge key={categoryTag.id} tag={categoryTag} categoryId={id} />
        ))}
      </td>
      <td>
        <ActionButton textButton='New Tag' buttonPrefixIcon='+' buttonSize='xs'>
          <NewTagForm categoryId={id} categoryName={name} />
        </ActionButton>
      </td>
    </tr>
  )
}

export default CategoriesRow
