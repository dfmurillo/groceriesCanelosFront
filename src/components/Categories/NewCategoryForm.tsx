'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useRef, useState } from 'react'
import { createCategory } from '@/actions/categoryActions'
import { CategoryType } from '@/schemas/Category/Category.type'
import { env } from 'env.mjs'

type ToastAlertStateType = {
  show: boolean
  message: string
  alertType: 'success' | 'error'
}

const NewCategoryForm = () => {
  const defaultToastAlertValues = {
    show: false,
    message: 'The category was saved',
    alertType: 'success',
  } as ToastAlertStateType

  const nameRef = useRef<HTMLInputElement>(null)
  const [toastAlert, setToastAlert] = useState<ToastAlertStateType>(defaultToastAlertValues)

  const queryClient = useQueryClient()
  const addCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) => [...oldCategories, newCategory])
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
      setToastAlert({ ...toastAlert, show: true, message: `The category ${newCategory.name} was saved` })
      setTimeout(() => {
        setToastAlert(defaultToastAlertValues)
      }, env.NEXT_PUBLIC_TOASTER_TIME)
    },
    onError: (error) => {
      console.log(`DFM__ error`, error)
    },
  })

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const name = nameRef.current?.value
    if (name) {
      await addCategoryMutation.mutate({ name })
      nameRef.current.value = ''
      nameRef.current.focus()
    }
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor='name'>
          <div className='label'>
            <span className='label-text'>Category Name:</span>
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

export default NewCategoryForm
