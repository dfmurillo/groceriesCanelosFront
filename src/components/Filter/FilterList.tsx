'use client'

import React from 'react'
import { useFilterContext } from '@/components/Providers/FilterContextProvider'
import { CategoryType } from '@/schemas/Category/Category.type'
import { FilterCategoryType } from './Filter.type'

type BaseFilterData = {
  id: number
  name: string
}

const FilterList = ({ filterData }: { filterData: CategoryType }) => {
  const { filter, setFilter } = useFilterContext()

  const handleFilterClick = (category: BaseFilterData, tag: BaseFilterData): void => {
    const currentFilter: FilterCategoryType = Object.assign({}, filter)
    const indexOfTag = currentFilter?.[category.id]?.findIndex(({ tagId: id }) => id === tag.id)

    if (indexOfTag === undefined || indexOfTag === -1) {
      let filtersCategory = Array.isArray(currentFilter?.[category.id]) ? currentFilter[category.id] : []
      if (filtersCategory === undefined) {
        filtersCategory = []
      }
      setFilter({
        ...currentFilter,
        [category.id]: [...filtersCategory, { tagId: tag.id, tagName: tag.name }],
      })
    }
  }

  const handleFilterClose = (categoryId: number, tagId: number): void => {
    const currentFilter = Object.assign({}, filter)
    const indexOfTag = currentFilter?.[categoryId]?.findIndex(({ tagId: id }) => id === tagId)
    if (indexOfTag !== undefined) currentFilter[categoryId]?.splice(indexOfTag, 1)
    setFilter(currentFilter)
  }

  return (
    <section>
      <div className='dropdown'>
        <div tabIndex={0} role='button' className='btn btn-accent m-1'>
          {filterData.name} ▾
          {filter?.[filterData.id]?.map(({ tagId, tagName }) => (
            <div
              className='badge badge-ghost gap-2'
              key={tagId}
              onClick={() => handleFilterClose(filterData.id, tagId)}
            >
              <button>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='inline-block h-4 w-4 stroke-current'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                </svg>
              </button>
              {tagName}
            </div>
          ))}
        </div>
        <ul tabIndex={0} className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow'>
          {filterData.categoryTags.map((tag) => (
            <li key={tag.id}>
              <button
                onClick={() =>
                  handleFilterClick({ id: filterData.id, name: filterData.name }, { id: tag.id, name: tag.name })
                }
              >
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FilterList
