import { useQuery } from '@tanstack/react-query'
import { throttle } from 'lodash'
import React, { forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Control, FieldErrors, useFieldArray, UseFormRegister } from 'react-hook-form'
import { getIngredientsWithTags } from '@/actions/ingredientActions'
import { IngredientType } from '@/schemas/Ingredient/Ingredient.type'
import { MenuFormCreateType } from '@/schemas/Menu/Menu.type'
import InputText from '../UI/FormElements/InputText'

type IngredientFilterMenuPropsType = {
  control: Control<MenuFormCreateType>
  errors: FieldErrors<MenuFormCreateType>
  register: UseFormRegister<MenuFormCreateType>
}

export type IngredientFilterMenuFunctionsType = {
  resetList: () => void
}

const MenuCreateIngredientList = forwardRef<IngredientFilterMenuFunctionsType, IngredientFilterMenuPropsType>(
  ({ control, register, errors }, ref) => {
    const searchIngredientRef = useRef<HTMLInputElement>(null)
    const [foundIngredients, setFoundIngredients] = useState<IngredientType[]>([])

    const { fields, remove, append } = useFieldArray({
      control,
      name: 'ingredients',
      rules: { minLength: 1 },
    })

    useEffect(() => {
      console.log(`DFM_ ln: 32 __ errors`, errors)
    }, [errors])

    useImperativeHandle(
      ref,
      () => ({
        resetList: () => remove(),
      }),
      [remove]
    )

    const { data: ingredientsList } = useQuery({
      queryKey: ['ingredients'],
      queryFn: getIngredientsWithTags,
    })
    const handleKeyUpSearchIngredient = () => {
      const ingredientSearch = searchIngredientRef.current?.value?.toLowerCase()
      if (!ingredientSearch) {
        setFoundIngredients([])
        return true
      }

      const usedIngredients = new Set<number>([...fields.map(({ ingredient }) => ingredient)])
      const matchIngredients = ingredientsList?.filter(
        ({ id, name }) => !usedIngredients.has(id) && name.startsWith(ingredientSearch)
      )
      if (matchIngredients?.length) setFoundIngredients(matchIngredients)
      else setFoundIngredients([])

      return true
    }

    const handleAddIngredient = (e: SyntheticEvent, { id, name }: { id: number; name: string }) => {
      e.preventDefault()
      append({
        ingredient: id,
        ingredientQuantity: 0,
        ingredientQuantityType: '',
        _name: name,
      })
      setFoundIngredients([])
      if (searchIngredientRef.current) searchIngredientRef.current.value = ''
    }

    const handleRemoveIngredient = (e: SyntheticEvent, ingredientPosition: number) => {
      e.preventDefault()
      remove(ingredientPosition)
    }

    return (
      <>
        <div className='divider divider-start'>Ingredients</div>
        <input
          onKeyUp={throttle(handleKeyUpSearchIngredient, 1000)}
          ref={searchIngredientRef}
          type='text'
          className='input input-bordered w-full max-w-xs'
          placeholder='Search Ingredient'
        />
        <div className='mt-2'>
          {foundIngredients?.map(({ id, name }) => (
            <button
              onClick={(e) => handleAddIngredient(e, { id, name })}
              key={id}
              className='badge badge-outline mx-1 gap-2 capitalize hover:font-bold hover:shadow-lg'
            >
              {name}
            </button>
          ))}
        </div>
        <ul className='mt-2'>
          {fields.map((ingredient, index) => (
            <li
              key={ingredient.id}
              className='mb-3 grid grid-cols-7 place-items-stretch content-evenly items-center gap-2 border-b-2 p-2'
            >
              <p className='col-span-2 capitalize'>{ingredient._name} -</p>
              <InputText
                containerClassName='col-span-2'
                inputProps={{
                  ...register(`ingredients.${index}.ingredientQuantity`, {
                    value: ingredient.ingredientQuantity,
                    valueAsNumber: true,
                  }),
                  type: 'number',
                  placeholder: 'Quantity',
                }}
              />
              <InputText
                containerClassName='col-span-2'
                inputProps={{
                  ...register(`ingredients.${index}.ingredientQuantityType`, {
                    value: ingredient.ingredientQuantityType,
                  }),
                  placeholder: 'Type',
                }}
              />
              <button
                className='btn btn-circle btn-outline btn-error w-8 place-self-center'
                onClick={(e) => handleRemoveIngredient(e, index)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
              <InputText
                inputProps={{
                  ...register(`ingredients.${index}.ingredient`, { value: ingredient.ingredient }),
                  type: 'hidden',
                }}
              />
            </li>
          ))}
        </ul>
      </>
    )
  }
)

MenuCreateIngredientList.displayName = 'MenuCreateIngredientListForwardRef'

export default MenuCreateIngredientList
