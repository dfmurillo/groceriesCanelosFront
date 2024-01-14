'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useRef, useState } from 'react'
import { CategoryType } from '@/schemas/Category/Category.type'
import { createTag } from '@/server/tagActions'
import { env } from 'env.mjs'

type ToastAlertStateType = {
  show: boolean
  message: string
  alertType: 'success' | 'error'
}

type NewTagFormPropsType = {
  categoryId: number
  categoryName: string
}

const NewTagForm = ({ categoryId, categoryName }: NewTagFormPropsType) => {
  const defaultToastAlertValues = {
    show: false,
    message: 'The tag was saved',
    alertType: 'success',
  } as ToastAlertStateType

  const nameRef = useRef<HTMLInputElement>(null)
  const [toastAlert, setToastAlert] = useState<ToastAlertStateType>(defaultToastAlertValues)

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
      setToastAlert({ ...toastAlert, show: true, message: `The tag ${newTag[0]?.name} was saved` })
      setTimeout(() => {
        setToastAlert(defaultToastAlertValues)
      }, env.NEXT_PUBLIC_TOASTER_TIME)
    },
  })

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const name = nameRef.current?.value
    if (name) {
      await addTagMutation.mutate({ name, categoryId })
      nameRef.current.value = ''
      nameRef.current.focus()
    }
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <h2 className='text-lg'>for {categoryName}.</h2>
        <label htmlFor='name'>
          <div className='label'>
            <span className='label-text'>Tag Name:</span>
          </div>
          <input ref={nameRef} type='text' placeholder='name' className='input input-bordered w-full max-w-xs' />
        </label>
        <div className='modal-action'>
          <button type='submit' className='btn btn-outline btn-success'>
            Save
          </button>
        </div>
      </form>
      {toastAlert.show && (
        <div className='toast toast-start'>
          <div className={`alert alert-${toastAlert.alertType}`}>
            <span>{toastAlert.message}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default NewTagForm
