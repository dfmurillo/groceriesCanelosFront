'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { createCategory } from '@/actions/categoryActions'
import { categoryCreateSchema } from '@/schemas/Category/Category.schema'
import { CategoryCreateType, CategoryType } from '@/schemas/Category/Category.type'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

const NewCategoryForm = () => {
  const toastRef = useRef<ToastFunctionsType>(null)
  const categoryFieldRef = useRef<InputTextFunctionsType>(null)
  const {
    reset,
    setFocus,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CategoryCreateType>({
    resolver: zodResolver(categoryCreateSchema),
  })

  useEffect(() => {
    if (errors?.name) {
      categoryFieldRef.current?.setError(errors.name.message ?? '')
    }
  }, [errors])

  const queryClient = useQueryClient()
  const addCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) => [...oldCategories, newCategory])
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
      toastRef.current?.setMessage(`The category ${newCategory.name} was saved`)
    },
    onError: (error) => {
      categoryFieldRef.current?.setError(error.message)
    },
  })

  const formSubmit = async (formData: CategoryCreateType) => {
    await addCategoryMutation.mutate({ name: formData.name })
    setFocus('name')
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)}>
        <InputText
          ref={categoryFieldRef}
          inputProps={{ ...register('name'), placeholder: 'Category Name' }}
          labelText='Category Name:'
        />
        <ButtonHolder>
          <Button
            action={ButtonActionEnum.SAVE}
            label={isSubmitting ? 'Saving...' : 'Save'}
            buttonProps={{
              type: 'submit',
              disabled: isSubmitting,
            }}
          />
        </ButtonHolder>
      </form>
      <Toast ref={toastRef} />
    </>
  )
}

export default NewCategoryForm
