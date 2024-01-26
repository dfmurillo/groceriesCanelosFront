'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { createTag } from '@/actions/tagActions'
import { CategoryType } from '@/schemas/Category/Category.type'
import { tagCreateSchema } from '@/schemas/Tag/Tag.schema'
import { TagCreateType } from '@/schemas/Tag/Tag.type'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

type NewTagFormPropsType = {
  categoryId: number
  categoryName: string
}

const NewTagForm = ({ categoryId, categoryName }: NewTagFormPropsType) => {
  const toastRef = useRef<ToastFunctionsType>(null)
  const tagFieldRef = useRef<InputTextFunctionsType>(null)
  const {
    reset,
    setFocus,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TagCreateType>({
    resolver: zodResolver(tagCreateSchema),
  })

  useEffect(() => {
    tagFieldRef.current?.setError(errors.name?.message ?? '')
  }, [errors])

  const queryClient = useQueryClient()
  const addTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: (newTag) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) =>
        oldCategories.map((category) => {
          const currentCategory = structuredClone(category)
          if (currentCategory.id === categoryId) {
            const tagsCategory = currentCategory.categoryTags ? currentCategory.categoryTags : []
            currentCategory.categoryTags = [...tagsCategory, ...newTag]
          }

          return currentCategory
        })
      )
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
      toastRef.current?.setMessage(`The tag ${newTag[0]?.name} was saved`)
    },
    onError: (error) => {
      tagFieldRef.current?.setError(error.message)
    },
  })

  const formSubmit = async (formData: TagCreateType) => {
    await addTagMutation.mutate({ name: formData.name, categoryId })
    setFocus('name')
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)}>
        <h2 className='text-lg'>for {categoryName}.</h2>
        <InputText
          ref={tagFieldRef}
          inputProps={{ ...register('name'), placeholder: 'Tag Name' }}
          labelText='Tag Name:'
        />
        <InputText
          inputProps={{
            ...register('categoryId', {
              value: categoryId,
            }),
            type: 'hidden',
          }}
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

export default NewTagForm
