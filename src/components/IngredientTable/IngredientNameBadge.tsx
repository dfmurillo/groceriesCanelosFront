import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { deleteIngredient, updateIngredient } from '@/actions/ingredientActions'
import { ingredientUpdateSchema } from '@/schemas/Ingredient/Ingredient.schema'
import { IngredientType, IngredientUpdateType } from '@/schemas/Ingredient/Ingredient.type'
import ActionButton from '../Categories/ActionButton'
import AlertDelete, { AlertDeleteFunctionsType } from '../UI/Alert/AlertDelete'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

type IngredientNameBadgePropsType = {
  ingredientId: number
  ingredientName: string
}

const IngredientNameBadge = ({ ingredientId, ingredientName }: IngredientNameBadgePropsType) => {
  const ingredientFieldRef = useRef<InputTextFunctionsType>(null)
  const toastRef = useRef<ToastFunctionsType>(null)
  const alertDeleteRef = useRef<AlertDeleteFunctionsType>(null)

  const {
    setFocus,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IngredientUpdateType>({
    resolver: zodResolver(ingredientUpdateSchema),
  })

  useEffect(() => {
    ingredientFieldRef.current?.setError(errors.name?.message ?? '')
  }, [errors])

  const queryClient = useQueryClient()
  const deleteIngredientMutation = useMutation({
    mutationFn: deleteIngredient,
    onSuccess: (data, deletedCategoryId) => {
      queryClient.setQueryData(['ingredients'], (oldIngredients: IngredientType[]) =>
        oldIngredients.filter(({ id }) => id !== deletedCategoryId)
      )
      queryClient.invalidateQueries({
        queryKey: ['ingredients'],
      })
      toastRef.current?.setMessage(`The ingredient was deleted`)
    },
    onError: (error) => {
      ingredientFieldRef.current?.setError(error.message)
    },
  })

  const updateIngredientMutation = useMutation({
    mutationFn: updateIngredient,
    onSuccess: (data, updatedIngredient) => {
      queryClient.setQueryData(['ingredients'], (oldIngredients: IngredientType[]) =>
        oldIngredients.map((ingredient) => {
          let newName = ''
          return { ...ingredient, name: ingredientId === updatedIngredient.id ? newName : ingredientName }
        })
      )
      queryClient.invalidateQueries({
        queryKey: ['ingredients'],
      })
      toastRef.current?.setMessage(`The category was updated`)
    },
    onError: (error) => {
      ingredientFieldRef.current?.setError(error.message)
    },
  })

  const handleFormSubmit = async (formData: IngredientUpdateType) => {
    updateIngredientMutation.mutate({ id: ingredientId, name: formData.name })
    setFocus('name')
  }

  const handleDeleteConfirmation = () => {
    alertDeleteRef.current?.setVisibility(true)
  }

  const handleDeleteCategory = async () => {
    await deleteIngredientMutation.mutate(ingredientId)
  }

  return (
    <ActionButton textButton={ingredientName} buttonSize='xs' buttonColor='ghost' className='first-letter:uppercase'>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mb-3'>
        <InputText
          ref={ingredientFieldRef}
          labelText='Ingredient Name:'
          inputProps={{
            ...register('name', {
              value: ingredientName,
            }),
            placeholder: 'Ingredient name',
          }}
        />
        <InputText
          inputProps={{
            ...register('id', {
              value: ingredientId,
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
  )
}

export default IngredientNameBadge
