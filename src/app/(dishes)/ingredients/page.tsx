import { Metadata } from 'next'
import CategoryFilter from '@/features/CategoryFilter/CategoryFilter'

export const metadata: Metadata = {
  title: 'Ingredients',
}

const IngredientsPage = () => {
  return (
    <>
      <section className='border-1 m-2 w-full rounded border-solid border-black bg-slate-50 p-3 shadow-md'>
        <h2>Filters</h2>
        <div className='flex flex-row flex-wrap'>
          <CategoryFilter />
        </div>
      </section>
      <section className='border-1 m-2 w-full rounded border-solid border-black bg-slate-50 p-3 shadow-md'>
        <h2>Ingredients</h2>
      </section>
    </>
  )
}

export default IngredientsPage
