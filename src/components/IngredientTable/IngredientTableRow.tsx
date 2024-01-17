import { IngredientType } from '@/schemas/Ingredient/Ingredient.type'
import IngredientTags from './IngredientTags'

type IngredientTableRowPropsType = {
  ingredient: IngredientType
}

const IngredientTableRow = ({ ingredient }: IngredientTableRowPropsType) => {
  return (
    <tr>
      <td className='first-letter:uppercase'>{ingredient.name}</td>
      <td>
        <IngredientTags ingredientId={ingredient.id} ingredientTags={ingredient.ingredientTags} />
      </td>
    </tr>
  )
}

export default IngredientTableRow
