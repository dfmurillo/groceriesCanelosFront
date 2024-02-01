'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { createMenu } from '@/actions/menuActions'
import { createMenuIngredients } from '@/actions/menuIngredientsActions'
import revalidateData from '@/app/actions'
import { menuFormCreateSchema } from '@/schemas/Menu/Menu.schema'
import { MenuFormCreateType } from '@/schemas/Menu/Menu.type'
import MenuCreateIngredientList, { IngredientFilterMenuFunctionsType } from './MenuCreateIngredientList'
import ActionButton from '../Categories/ActionButton'
import IngredientCreateForm from '../IngredientCreate/IngredientCreateForm'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import TextArea, { TextAreaFunctionsType } from '../UI/FormElements/TextArea'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

const MenuCreateForm = () => {
  const toastRef = useRef<ToastFunctionsType>(null)
  const nameFieldRef = useRef<InputTextFunctionsType>(null)
  const numberOfPeopleFieldRef = useRef<InputTextFunctionsType>(null)
  const detailsFieldRef = useRef<TextAreaFunctionsType>(null)
  const ingredientListRef = useRef<IngredientFilterMenuFunctionsType>(null)

  const {
    reset,
    setFocus,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<MenuFormCreateType>({
    resolver: zodResolver(menuFormCreateSchema),
  })

  useEffect(() => {
    nameFieldRef.current?.setError(errors?.name?.message ?? '')
    numberOfPeopleFieldRef.current?.setError(errors?.menuPax?.message ?? '')
    detailsFieldRef.current?.setError(errors?.detail?.message ?? '')
  }, [errors])

  const formSubmit = async (formData: MenuFormCreateType) => {
    const { id: menu } = await createMenu({
      name: formData.name,
      menuPax: formData.menuPax,
      detail: formData.detail,
    })

    const ingredientsList = formData.ingredients?.map(({ ingredient, ingredientQuantity, ingredientQuantityType }) => ({
      ingredient,
      ingredientQuantity,
      ingredientQuantityType,
      menu,
    }))

    if (ingredientsList) await createMenuIngredients(ingredientsList)

    setFocus('name')
    revalidateData('menus')
    ingredientListRef.current?.resetList()
    reset()

    toastRef.current?.setMessage(`The Menu was saved`)
  }

  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)}>
        <InputText
          ref={nameFieldRef}
          inputProps={{ ...register('name'), placeholder: 'Menu name' }}
          labelText='Menu Name:'
        />
        <InputText
          ref={numberOfPeopleFieldRef}
          inputProps={{
            ...register('menuPax', { valueAsNumber: true, min: 1, value: 1 }),
            placeholder: 'Number of people',
            type: 'number',
          }}
          labelText='Number of people:'
        />
        <TextArea ref={detailsFieldRef} labelText='Details:' inputProps={register('detail')} />
        <MenuCreateIngredientList ref={ingredientListRef} control={control} errors={errors} register={register} />
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
      <ActionButton textButton='New Ingredient' buttonPrefixIcon='+' buttonSize='xs'>
        <IngredientCreateForm />
      </ActionButton>
      <Toast ref={toastRef} />
    </>
  )
}

export default MenuCreateForm
