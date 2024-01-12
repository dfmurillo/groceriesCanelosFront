import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { CategoryType } from '@/schemas/Category/Category.type'
import { TagType } from '@/schemas/Tag/Tag.type'
import { deleteTag } from '@/server/tagActions'
import { env } from 'env.mjs'
import ActionButton from './ActionButton'
import AlertDelete from '../Alert/AlertDelete'

type CategoriesTagBadgePropsType = {
  tag: TagType
  categoryId: number
}

type ToastAlertStateType = {
  show: boolean
  message: string
  alertType: 'success' | 'error'
}

const CategoriesTagBadge = ({ tag, categoryId }: CategoriesTagBadgePropsType) => {
  const defaultToastAlertValues = {
    show: false,
    message: 'The tag was saved',
    alertType: 'success',
  } as ToastAlertStateType

  const nameRef = useRef<HTMLInputElement>(null)
  const [toastAlert, setToastAlert] = useState<ToastAlertStateType>(defaultToastAlertValues)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const queryClient = useQueryClient()
  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: (data, deletedTagId) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) =>
        oldCategories.map((category) => {
          let currentCategory = structuredClone(category)
          if (currentCategory.id === categoryId) {
            const categoryTags = currentCategory.categoryTags?.filter(({ id }) => id !== deletedTagId)
            currentCategory = { ...currentCategory, categoryTags }
          }
          return currentCategory
        })
      )
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
      setToastAlert({ ...toastAlert, show: true, message: `The tag was deleted` })
      setTimeout(() => {
        setToastAlert(defaultToastAlertValues)
      }, env.NEXT_PUBLIC_TOASTER_TIME)
    },
  })

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const name = nameRef.current?.value
    if (name) {
    }
  }

  const handleDeleteConfirmation = (event: SyntheticEvent) => {
    event.preventDefault()
    setShowDeleteAlert(true)
  }

  const handleDeleteTag = async () => {
    await deleteTagMutation.mutate(tag.id)
  }

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = tag.name
  })

  return (
    <>
      <ActionButton textButton={tag.name} buttonPrefixIcon='🔖' buttonSize='xs' buttonColor='ghost'>
        <form onSubmit={handleFormSubmit} className='mb-3'>
          <label htmlFor='name'>
            <div className='label'>
              <span className='label-text'>Tag Name:</span>
            </div>
            <input ref={nameRef} type='text' placeholder='name' className='input input-bordered w-full max-w-xs' />
          </label>
          <div className='modal-action place-content-between'>
            <button onClick={handleDeleteConfirmation} className='btn btn-outline btn-error'>
              Delete
            </button>
            <button type='submit' className='btn btn-outline btn-success'>
              Edit
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

export default CategoriesTagBadge