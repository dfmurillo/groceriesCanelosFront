import IngredientTableBody from './IngredientTableBody'
import CategoryTagsProvider from '../Providers/CategoryTagsProvider'

const IngredientTable = () => {
  return (
    <div className='center flex flex-row flex-wrap'>
      <div className='w-full overflow-x-auto'>
        <table className='table table-zebra'>
          {/* head */}
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            <CategoryTagsProvider>
              <IngredientTableBody />
            </CategoryTagsProvider>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IngredientTable
