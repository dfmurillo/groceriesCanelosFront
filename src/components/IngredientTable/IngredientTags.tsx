import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useRef } from 'react'
import { IngredientTagsType } from '@/schemas/IngredientTag/IngredientTag.type'
import { createIngredientTag } from '@/server/ingredientTagActions'
import { useCategoryTagsContext } from '../providers/CategoryTagsProvider'

type IngredientTagsPropsType = {
  ingredientTags: IngredientTagsType[]
  ingredientId: number
}

const IngredientTags = ({ ingredientTags, ingredientId }: IngredientTagsPropsType) => {
  const { categoryTags } = useCategoryTagsContext()
  const selectRef = useRef<HTMLSelectElement>(null)

  const updateIngredientTagMutation = useMutation({
    mutationFn: createIngredientTag,
    onSuccess: (data, updatedIngredientTag) => {
      console.log(`DFM_ ln: 16 __ data`, data)
      console.log(`DFM_ ln: 17 __ updatedIngredientTag`, updatedIngredientTag)
    },
  })

  const handleTagSelect = (event: SyntheticEvent) => {
    event.preventDefault()
    const tagId = selectRef.current?.value
    if (tagId) updateIngredientTagMutation.mutate({ ingredientId, tagId: +tagId })
  }

  return (
    <>
      {ingredientTags?.map(({ id, tag }) => (
        //TODO create only 1 component for tag badges
        <div key={id} className='btn btn-ghost btn-xs m-3 whitespace-nowrap'>
          🔖 {tag?.name}
          <button className='badge badge-error badge-sm'>X</button>
        </div>
      ))}
      <select
        defaultValue={'placeholder'}
        ref={selectRef}
        className='select select-bordered select-sm w-full max-w-xs'
        onSelect={handleTagSelect}
      >
        <option disabled value={'placeholder'}>
          New tag
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
