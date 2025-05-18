import { Metadata } from 'next'
import ActionButton from '@/components/Categories/ActionButton'
import IngredientCreateForm from '@/components/IngredientCreate/IngredientCreateForm'
import IngredientTable from '@/components/IngredientTable/IngredientTable'
import CategoryFilter from '@/features/CategoryFilter/CategoryFilter'

export const metadata: Metadata = {
  title: 'Ingredients',
}

const IngredientsPage = () => {
  return (
    <>
      <section
        data-testid='filters-section'
        className='border-1 m-2 w-full rounded border-solid border-black bg-slate-50 p-3 shadow-md'
      >
        <h2 className='text-lg font-bold'>Filters</h2>
        <div className='flex flex-row flex-wrap'>
          <CategoryFilter />
        </div>
      </section>
      <section
        data-testid='ingredients-section'
        className='border-1 m-2 w-full rounded border-solid border-black bg-slate-50 p-3 shadow-md'
      >
        <ActionButton textButton='New Ingredient' buttonPrefixIcon='+'>
          <IngredientCreateForm />
        </ActionButton>
        <h2 className='text-lg font-bold'>Ingredients</h2>
        <div className='flex flex-row flex-wrap'>
          <IngredientTable />
        </div>
      </section>
    </>
  )
}

export default IngredientsPage
