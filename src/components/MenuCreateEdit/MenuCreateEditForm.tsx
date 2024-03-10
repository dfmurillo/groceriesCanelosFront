'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { createMenu, updateMenu } from '@/actions/menuActions'
import { createMenuIngredients, updateMenuIngredients } from '@/actions/menuIngredientsActions'
import revalidateData from '@/app/actions'
import { menuFormSchema } from '@/schemas/Menu/Menu.schema'
import { MenuFormType, MenuWithIngredientsType } from '@/schemas/Menu/Menu.type'
import { MenuIngredientCreateType, MenuIngredientUpdateType } from '@/schemas/MenuIngredient/MenuIngredient.type'
import MenuCreateEditIngredientList, { IngredientFilterMenuFunctionsType } from './MenuCreateEditIngredientList'
import ActionButton from '../Categories/ActionButton'
import IngredientCreateForm from '../IngredientCreate/IngredientCreateForm'
import Button, { ButtonActionEnum } from '../UI/FormElements/Button'
import ButtonHolder from '../UI/FormElements/ButtonHolder'
import InputText, { InputTextFunctionsType } from '../UI/FormElements/InputText'
import TextArea, { TextAreaFunctionsType } from '../UI/FormElements/TextArea'
import Toast, { ToastFunctionsType } from '../UI/Toast/Toast'

type MenuCreateEditFormPropsType = {
  editMenu?: MenuWithIngredientsType
}

const MenuCreateEditForm = ({ editMenu }: MenuCreateEditFormPropsType) => {
  const isEditing = !!editMenu
  const toastRef = useRef<ToastFunctionsType>(null)
  const nameFieldRef = useRef<InputTextFunctionsType>(null)
  const numberOfPeopleFieldRef = useRef<InputTextFunctionsType>(null)
  const detailsFieldRef = useRef<TextAreaFunctionsType>(null)
  const ingredientListRef = useRef<IngredientFilterMenuFunctionsType>(null)

  let formDefaultValues = {} as MenuFormType
  if (editMenu) {
    const editIngredients = editMenu.menuIngredient?.map(
      ({ id, ingredientQuantity, ingredientQuantityType, ingredient: { id: ingredientId, name } }) => ({
        ingredientQuantity,
        ingredientQuantityType,
        ingredient: ingredientId,
        _name: name,
        _id: id,
      })
    )
    formDefaultValues = {
      detail: editMenu.detail,
      menuPax: editMenu.menuPax,
      name: editMenu.name,
      ingredients: editIngredients,
    }
  }

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<MenuFormType>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: formDefaultValues,
  })

  useEffect(() => {
    nameFieldRef.current?.setError(errors?.name?.message ?? '')
    numberOfPeopleFieldRef.current?.setError(errors?.menuPax?.message ?? '')
    detailsFieldRef.current?.setError(errors?.detail?.message ?? '')
  }, [errors])

  const formCreateSubmit = async (formData: MenuFormType) => {
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

    revalidateData('menus')
    ingredientListRef.current?.resetList()
    toastRef.current?.setMessage(`The Menu was saved`)
    reset()
  }

  const formEditSubmit = async (formData: MenuFormType) => {
    if (editMenu?.id) {
      await updateMenu({
        id: editMenu.id,
        name: formData.name,
        menuPax: formData.menuPax,
        detail: formData.detail || undefined,
      })

      const ingredientsToSaveOrEdit: {
        toEdit: MenuIngredientUpdateType[]
        toSave: MenuIngredientCreateType[]
      } = { toEdit: [], toSave: [] }
      const formDataIngredients = formData.ingredients || []

      for (const currentIngredient of formDataIngredients) {
        if (currentIngredient._id === null) {
          ingredientsToSaveOrEdit.toSave.push({
            ingredient: currentIngredient.ingredient,
            ingredientQuantity: currentIngredient.ingredientQuantity,
            ingredientQuantityType: currentIngredient.ingredientQuantityType,
            menu: editMenu.id,
          })
        } else {
          ingredientsToSaveOrEdit.toEdit.push({
            id: currentIngredient._id,
            ingredientQuantity: currentIngredient.ingredientQuantity,
            ingredientQuantityType: currentIngredient.ingredientQuantityType,
          })
        }
      }

      if (ingredientsToSaveOrEdit.toSave.length > 0) {
        await createMenuIngredients(ingredientsToSaveOrEdit.toSave)
      }

      if (ingredientsToSaveOrEdit.toEdit.length > 0) {
        for (const ingredientToEdit of ingredientsToSaveOrEdit.toEdit) {
          await updateMenuIngredients(ingredientToEdit)
        }
      }

      revalidateData('menus')
      toastRef.current?.setMessage(`The Menu was edited`)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(isEditing ? formEditSubmit : formCreateSubmit)}>
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
        <MenuCreateEditIngredientList
          isEditing={isEditing}
          ref={ingredientListRef}
          control={control}
          errors={errors}
          register={register}
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
      <hr className='my-3' />
      <ActionButton textButton='New Ingredient' buttonPrefixIcon='+' buttonSize='xs'>
        <IngredientCreateForm />
      </ActionButton>
    </>
  )
}

export default MenuCreateEditForm
