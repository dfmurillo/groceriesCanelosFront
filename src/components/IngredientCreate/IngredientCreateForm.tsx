'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { createIngredient } from '@/actions/ingredientActions'
import { ingredientCreateSchema } from '@/schemas/Ingredient/Ingredient.schema'
import { IngredientCreateType, IngredientType } from '@/schemas/Ingredient/Ingredient.type'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

const IngredientCreateForm = () => {
  const toastRef = useRef<ToastFunctionsType>(null)
  const ingredientFieldRef = useRef<InputTextFunctionsType>(null)
  const {
    reset,
    setFocus,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IngredientCreateType>({
    resolver: zodResolver(ingredientCreateSchema),
  })

  useEffect(() => {
    if (errors?.name) {
      ingredientFieldRef.current?.setError(errors.name.message ?? '')
    }
  }, [errors])

  const queryClient = useQueryClient()
  const addIngredientMutation = useMutation({
    mutationFn: createIngredient,
    onSuccess: (newIngredient) => {
      queryClient.setQueryData(['ingredients'], (oldIngredients: IngredientType[]) => [
        ...oldIngredients,
        ...newIngredient,
      ])
      queryClient.invalidateQueries({
        queryKey: ['ingredients'],
      })
      let ingredientList = ''
      for (const ingredient of newIngredient) {
        ingredientList += `${ingredient.name} `
      }
      toastRef.current?.setMessage(`The ingredient ${ingredientList} was saved`)
    },
    onError: (error) => {
      ingredientFieldRef.current?.setError(error.message)
    },
  })

  const formSubmit = async (formData: IngredientCreateType) => {
    await addIngredientMutation.mutate({ name: formData.name })
    setFocus('name')
    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)}>
        <InputText
          ref={ingredientFieldRef}
          inputProps={{ ...register('name'), placeholder: 'Ingredient Name' }}
          labelText='Ingredient Name:'
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

export default IngredientCreateForm
