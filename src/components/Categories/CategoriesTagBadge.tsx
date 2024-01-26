import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { deleteTag, updateTag } from '@/actions/tagActions'
import { CategoryType } from '@/schemas/Category/Category.type'
import { tagSchema } from '@/schemas/Tag/Tag.schema'
import { TagType, TagUpdateType } from '@/schemas/Tag/Tag.type'
import ActionButton from './ActionButton'
import AlertDelete, { AlertDeleteFunctionsType } from '../UI/Alert/AlertDelete'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

type CategoriesTagBadgePropsType = {
  tag: TagType
  categoryId: number
}

const CategoriesTagBadge = ({ tag, categoryId }: CategoriesTagBadgePropsType) => {
  const tagFieldRef = useRef<InputTextFunctionsType>(null)
  const toastRef = useRef<ToastFunctionsType>(null)
  const alertDeleteRef = useRef<AlertDeleteFunctionsType>(null)
  const {
    setFocus,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TagUpdateType>({
    resolver: zodResolver(tagSchema),
  })

  useEffect(() => {
    tagFieldRef.current?.setError(errors.name?.message ?? '')
  }, [errors])

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
      toastRef.current?.setMessage(`The tag was deleted`)
    },
    onError: (error) => {
      tagFieldRef.current?.setError(error.message)
    },
  })

  const updateTagMutation = useMutation({
    mutationFn: updateTag,
    onSuccess: (data, updatedTag) => {
      queryClient.setQueryData(['categories'], (oldCategories: CategoryType[]) =>
        oldCategories.map((category) => {
          let currentCategory = structuredClone(category)
          if (currentCategory.id === categoryId) {
            const categoryTags = currentCategory.categoryTags?.map(({ id, name }) => {
              if (updatedTag.id === id) {
                return { id, name: updatedTag.name }
              }

              return { id, name }
            })
            currentCategory = { ...currentCategory, categoryTags }
          }
          return currentCategory
        })
      )
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
      toastRef.current?.setMessage(`The tag was updated`)
    },
    onError: (error) => {
      tagFieldRef.current?.setError(error.message)
    },
  })

  const formSubmit = async (formData: TagUpdateType) => {
    await updateTagMutation.mutate({ id: tag.id, name: formData.name })
    setFocus('name')
  }

  const handleDeleteConfirmation = () => {
    alertDeleteRef.current?.setVisibility(true)
  }

  const handleDeleteTag = async () => {
    await deleteTagMutation.mutate(tag.id)
  }

  return (
    <>
      <ActionButton textButton={tag.name} buttonPrefixIcon='🔖' buttonSize='xs' buttonColor='ghost'>
        <form onSubmit={handleSubmit(formSubmit)} className='mb-3'>
          <InputText
            ref={tagFieldRef}
            labelText='Tag Name:'
            inputProps={{
              ...register('name', {
                value: tag.name,
              }),
              placeholder: 'Tag name',
            }}
          />
          <InputText
            inputProps={{
              ...register('id', { value: tag.id }),
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
        <AlertDelete ref={alertDeleteRef} alertText='Are you sure?' handleAction={handleDeleteTag} />
      </ActionButton>
    </>
  )
}

export default CategoriesTagBadge
