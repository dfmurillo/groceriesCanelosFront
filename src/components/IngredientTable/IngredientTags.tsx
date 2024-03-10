import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useMemo, useRef, useState } from 'react'
import { createIngredientTag, deleteIngredientTag } from '@/actions/ingredientTagActions'
import { IngredientType } from '@/schemas/Ingredient/Ingredient.type'
import { IngredientTagsType } from '@/schemas/IngredientTag/IngredientTag.type'
import { addTagToIngredient, removeTagFromIngredient } from '@/utils/ingredients'
import { useCategoryTagsContext } from '../../contexts/CategoryTagsProvider'

type IngredientTagsPropsType = {
  ingredientTags: IngredientTagsType[]
  ingredientId: number
}

const IngredientTags = ({ ingredientTags, ingredientId }: IngredientTagsPropsType) => {
  const defaultSelectValue = 'placeholder'
  const [selectValue, setSelectValue] = useState(defaultSelectValue)
  const { categoryTags } = useCategoryTagsContext()
  const queryClient = useQueryClient()
  const selectRef = useRef<HTMLSelectElement>(null)
  const tagsMemo = useMemo(() => categoryTags.flatMap(({ categoryTags: tags }) => tags), [categoryTags])

  const updateIngredientTagMutation = useMutation({
    mutationFn: createIngredientTag,
    onSuccess: (data) => {
      queryClient.setQueryData(['ingredients'], (oldIngredients: IngredientType[]) => {
        const tagName = tagsMemo?.find((tag) => tag?.id && tag.id === data.tag.id)?.name
        const ingredientTag = {
          id: data.id,
          tag: { id: data.tag.id, name: tagName ? tagName : 'error' },
        }
        return addTagToIngredient(oldIngredients, data.ingredient.id, ingredientTag)
      })
      setSelectValue(defaultSelectValue)
    },
    onError: (error) => {
      console.log(`DFM__ error`, error)
    },
  })

  const deleteIngredientTagMutation = useMutation({
    mutationFn: deleteIngredientTag,
    onError: (error) => {
      console.log(`DFM__ error`, error)
    },
    onSuccess: (data, ingredientTagId) => {
      queryClient.setQueryData(['ingredients'], (oldIngredients: IngredientType[]) => {
        return removeTagFromIngredient(oldIngredients, ingredientId, ingredientTagId)
      })
    },
  })

  const handleTagSelect = (event: SyntheticEvent) => {
    event.preventDefault()
    const tagId = selectRef.current?.value
    if (tagId) updateIngredientTagMutation.mutate({ ingredientId, tagId: +tagId })
  }

  const handleIngredientTagDelete = (event: SyntheticEvent, ingredientTagId: number) => {
    event.preventDefault()
    deleteIngredientTagMutation.mutate(ingredientTagId)
  }

  return (
    <>
      {ingredientTags?.map(({ id, tag }) => (
        //TODO create only 1 component for tag badges
        <div key={id} className='btn btn-ghost btn-xs m-3 whitespace-nowrap'>
          🔖 {tag?.name}
          <button onClick={(event) => handleIngredientTagDelete(event, id)} className='badge badge-error badge-sm'>
            X
          </button>
        </div>
      ))}
      <select
        value={selectValue}
        ref={selectRef}
        className='select select-bordered select-sm w-full max-w-xs'
        onChange={handleTagSelect}
      >
        <option disabled value={defaultSelectValue}>
          Add tag
        </option>
        {categoryTags?.map(({ id, name, categoryTags }) => (
          <optgroup key={id} label={name}>
            {categoryTags?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </>
  )
}

export default IngredientTags
