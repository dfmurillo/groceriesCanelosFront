import { CategoryType } from '@/schemas/Category/Category.type'
import ActionButton from './ActionButton'
import CategoriesTagBadge from './CategoriesTagBadge'
import CategoryBadge from './CategoryBadge'
import NewTagForm from './NewTagForm'

export const CategoriesTagsBadges = () => {}

const CategoriesRow = ({ id, name, categoryTags }: CategoryType) => {
  return (
    <tr>
      <td>
        <CategoryBadge categoryId={id} categoryName={name} />
      </td>
      <td>
        {categoryTags?.map((categoryTag) => (
          <CategoriesTagBadge key={categoryTag.id} tag={categoryTag} categoryId={id} />
        ))}
        <ActionButton textButton='New Tag' buttonPrefixIcon='+' buttonSize='xs'>
          <NewTagForm categoryId={id} categoryName={name} />
        </ActionButton>
      </td>
    </tr>
  )
}

export default CategoriesRow
