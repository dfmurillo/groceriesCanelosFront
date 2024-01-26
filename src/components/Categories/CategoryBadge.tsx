import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { deleteCategory, updateCategory } from '@/actions/categoryActions'
import { categoryUpdateSchema } from '@/schemas/Category/Category.schema'
import { CategoryType, CategoryUpdateType } from '@/schemas/Category/Category.type'
import ActionButton from './ActionButton'
import AlertDelete, { AlertDeleteFunctionsType } from '../UI/Alert/AlertDelete'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

type CategoriesTagBadgePropsType = {
  categoryId: number
  categoryName: string
}

const CategoryBadge = ({ categoryId, categoryName }: CategoriesTagBadgePropsType) => {
  const categoryFieldRef = useRef<InputTextFunctionsType>(null)
  const toastRef = useRef<ToastFunctionsType>(null)
  const alertDeleteRef = useRef<AlertDeleteFunctionsType>(null)

  const {
    setFocus,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CategoryUpdateType>({
    resolver: zodResolver(categoryUpdateSchema),
  })

  useEffect(() => {
    categoryFieldRef.current?.setError(errors.name?.message ?? '')
  }, [errors])

  const queryClient = useQueryClient()
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data, deletedCategoryId) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) =>
        oldCategories.filter(({ id }) => id !== deletedCategoryId)
      )
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
      toastRef.current?.setMessage(`The category was deleted`)
    },
    onError: (error) => {
      categoryFieldRef.current?.setError(error.message)
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: (data, updatedCategory) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) =>
        oldCategories.map((category) => {
          let newName = ''
          return { ...category, name: categoryId === updatedCategory.id ? newName : categoryName }
        })
      )
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
      toastRef.current?.setMessage(`The category was updated`)
    },
    onError: (error) => {
      categoryFieldRef.current?.setError(error.message)
    },
  })

  const handleFormSubmit = async (formData: CategoryUpdateType) => {
    updateCategoryMutation.mutate({ id: categoryId, name: formData.name })
    setFocus('name')
  }

  const handleDeleteConfirmation = () => {
    alertDeleteRef.current?.setVisibility(true)
  }

  const handleDeleteCategory = async () => {
    await deleteCategoryMutation.mutate(categoryId)
  }

  return (
    <>
      <ActionButton textButton={categoryName} buttonPrefixIcon='📋' buttonSize='xs' buttonColor='ghost'>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='mb-3'>
          <InputText
            ref={categoryFieldRef}
            labelText='Category Name:'
            inputProps={{
              ...register('name', {
                value: categoryName,
              }),
              placeholder: 'Category name',
            }}
          />
          <InputText
            inputProps={{
              ...register('id', {
                value: categoryId,
              }),
              type: 'hidden',
            }}
          />
          <ButtonHolder>
            <Button
              action={ButtonActionEnum.DELETE}
              label='Delete'
              buttonProps={{ type: 'button', onClick: handleDeleteConfirmation }}
            />
            <Button
              action={ButtonActionEnum.SAVE}
              label={isSubmitting ? 'Editing...' : 'Edit'}
              buttonProps={{ type: 'submit', disabled: isSubmitting }}
            />
          </ButtonHolder>
        </form>
        <Toast ref={toastRef} />
        <AlertDelete ref={alertDeleteRef} alertText='Are you sure?' handleAction={handleDeleteCategory} />
      </ActionButton>
    </>
  )
}

export default CategoryBadge
