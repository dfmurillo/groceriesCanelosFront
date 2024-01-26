import { IngredientType } from '@/schemas/Ingredient/Ingredient.type'
import IngredientNameBadge from './IngredientNameBadge'
import IngredientTags from './IngredientTags'

type IngredientTableRowPropsType = {
  ingredient: IngredientType
}

const IngredientTableRow = ({ ingredient }: IngredientTableRowPropsType) => {
  return (
    <tr>
      <td>
        <IngredientNameBadge ingredientId={ingredient.id} ingredientName={ingredient.name} />
      </td>
      <td>
        <IngredientTags ingredientId={ingredient.id} ingredientTags={ingredient.ingredientTags ?? []} />
      </td>
    </tr>
  )
}

export default IngredientTableRow
