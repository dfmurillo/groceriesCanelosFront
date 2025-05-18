import { render, screen } from '@testing-library/react'
import { CategoryType } from '@/schemas/Category/Category.type'
import CategoriesRow from '../CategoriesRow'

// Mock child components
jest.mock('../CategoryBadge', () => {
  const Mock = ({ categoryId, categoryName }: any) => (
    <div data-testid='category-badge'>
      {categoryId}-{categoryName}
    </div>
  )
  Mock.displayName = 'MockCategoryBadge'
  return Mock
})
jest.mock('../CategoriesTagBadge', () => {
  const Mock = ({ tag, categoryId }: any) => (
    <div data-testid='tag-badge'>
      {tag.name}-{categoryId}
    </div>
  )
  Mock.displayName = 'MockCategoriesTagBadge'
  return Mock
})
jest.mock('../ActionButton', () => {
  const Mock = ({ children, ...props }: any) => (
    <button data-testid='action-button' {...props}>
      {children}
    </button>
  )
  Mock.displayName = 'MockActionButton'
  return Mock
})
jest.mock('../NewTagForm', () => {
  const Mock = ({ categoryId, categoryName }: any) => (
    <form data-testid='new-tag-form'>
      {categoryId}-{categoryName}
    </form>
  )
  Mock.displayName = 'MockNewTagForm'
  return Mock
})

describe('CategoriesRow', () => {
  const baseCategory: CategoryType = {
    id: 1,
    name: 'Fruits',
    categoryTags: [
      { id: 101, name: 'Citrus' },
      { id: 102, name: 'Tropical' },
    ],
  }

  it('renders the category badge with correct props', () => {
    render(<CategoriesRow {...baseCategory} />)
    expect(screen.getByTestId('category-badge')).toHaveTextContent('1-Fruits')
  })

  it('renders all tag badges for each tag', () => {
    render(<CategoriesRow {...baseCategory} />)
    const tagBadges = screen.getAllByTestId('tag-badge')
    expect(tagBadges).toHaveLength(2)
    expect(tagBadges[0]).toHaveTextContent('Citrus-1')
    expect(tagBadges[1]).toHaveTextContent('Tropical-1')
  })

  it('renders the ActionButton with NewTagForm as child', () => {
    render(<CategoriesRow {...baseCategory} />)
    const actionButton = screen.getByTestId('action-button')
    expect(actionButton).toBeInTheDocument()
    expect(screen.getByTestId('new-tag-form')).toHaveTextContent('1-Fruits')
  })

  it('handles empty categoryTags gracefully', () => {
    render(<CategoriesRow id={2} name='Vegetables' categoryTags={[]} />)
    expect(screen.queryAllByTestId('tag-badge')).toHaveLength(0)
    expect(screen.getByTestId('category-badge')).toHaveTextContent('2-Vegetables')
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
  })

  it('handles missing categoryTags gracefully', () => {
    render((<CategoriesRow id={3} name='Dairy' />) as any)
    expect(screen.queryAllByTestId('tag-badge')).toHaveLength(0)
    expect(screen.getByTestId('category-badge')).toHaveTextContent('3-Dairy')
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
  })
})
