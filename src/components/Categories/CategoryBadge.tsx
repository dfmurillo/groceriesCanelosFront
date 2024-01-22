import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { deleteCategory, updateCategory } from '@/actions/categoryActions'
import { CategoryType } from '@/schemas/Category/Category.type'
import { env } from 'env.mjs'
import ActionButton from './ActionButton'
import AlertDelete from '../Alert/AlertDelete'

type CategoriesTagBadgePropsType = {
  categoryId: number
  categoryName: string
}

type ToastAlertStateType = {
  show: boolean
  message: string
  alertType: 'success' | 'error'
}

const CategoryBadge = ({ categoryId, categoryName }: CategoriesTagBadgePropsType) => {
  const defaultToastAlertValues = {
    show: false,
    message: 'The category was saved',
    alertType: 'success',
  } as ToastAlertStateType

  const nameRef = useRef<HTMLInputElement>(null)
  const [toastAlert, setToastAlert] = useState<ToastAlertStateType>(defaultToastAlertValues)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

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
      setToastAlert({ ...toastAlert, show: true, message: `The category was deleted` })
      setTimeout(() => {
        setToastAlert(defaultToastAlertValues)
      }, env.NEXT_PUBLIC_TOASTER_TIME)
    },
    onError: (error) => {
      console.log(`DFM__ error`, error)
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
      setToastAlert({ ...toastAlert, show: true, message: `The category was updated` })
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
      updateCategoryMutation.mutate({ id: categoryId, name })
    }
  }

  const handleDeleteConfirmation = (event: SyntheticEvent) => {
    event.preventDefault()
    setShowDeleteAlert(true)
  }

  const handleDeleteTag = async () => {
    await deleteCategoryMutation.mutate(categoryId)
  }

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.value = categoryName
      nameRef.current.focus()
    }
  })

  return (
    <>
      <ActionButton textButton={categoryName} buttonPrefixIcon='📋' buttonSize='xs' buttonColor='ghost'>
        <form onSubmit={handleFormSubmit} className='mb-3'>
          <label htmlFor='name'>
            <div className='label'>
              <span className='label-text'>Category Name:</span>
            </div>
            <input ref={nameRef} type='text' placeholder='name' className='input input-bordered w-full max-w-xs' />
          </label>
          <div className='modal-action place-content-between'>
            <button type='button' onClick={handleDeleteConfirmation} className='btn btn-outline btn-error'>
              Delete
            </button>
            <button type='submit' className='btn btn-outline btn-success'>
              Edit
            </button>
          </div>
        </form>
        {toastAlert.show && (
          <div className='toast toast-center toast-top'>
            <div className={`alert alert-${toastAlert.alertType}`}>
              <span>{toastAlert.message}</span>
            </div>
          </div>
        )}
        {showDeleteAlert && (
          <AlertDelete
            alertText='Are you sure?'
            handleDeleteAction={handleDeleteTag}
            setShowDeleteAlert={setShowDeleteAlert}
          />
        )}
      </ActionButton>
    </>
  )
}

export default CategoryBadge
