import { render, screen } from '@testing-library/react'
import IngredientsPage from '../page'

// Mock the components used in the page
jest.mock('@/components/Categories/ActionButton', () => {
  return function MockActionButton({ children, textButton }: { children: React.ReactNode; textButton: string }) {
    return (
      <div data-testid='action-button'>
        <span>{textButton}</span>
        {children}
      </div>
    )
  }
})

jest.mock('@/components/IngredientCreate/IngredientCreateForm', () => {
  return function MockIngredientCreateForm() {
    return <div data-testid='ingredient-create-form' />
  }
})

jest.mock('@/components/IngredientTable/IngredientTable', () => {
  return function MockIngredientTable() {
    return <div data-testid='ingredient-table' />
  }
})

jest.mock('@/features/CategoryFilter/CategoryFilter', () => {
  return function MockCategoryFilter() {
    return <div data-testid='category-filter' />
  }
})

describe('IngredientsPage', () => {
  it('renders the page with correct title', () => {
    render(<IngredientsPage />)
    expect(screen.getByText('Ingredients')).toBeInTheDocument()
  })

  it('renders the filters section with correct structure', () => {
    render(<IngredientsPage />)

    // Check for filters section
    const filtersHeading = screen.getByRole('heading', { name: 'Filters' })
    expect(filtersHeading).toBeInTheDocument()

    // Check for category filter
    expect(screen.getByTestId('category-filter')).toBeInTheDocument()
  })

  it('renders the ingredients section with correct structure', () => {
    render(<IngredientsPage />)

    // Check for ingredients section
    const ingredientsHeading = screen.getByRole('heading', { name: 'Ingredients' })
    expect(ingredientsHeading).toBeInTheDocument()

    // Check for action button
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
    expect(screen.getByText('New Ingredient')).toBeInTheDocument()

    // Check for create form
    expect(screen.getByTestId('ingredient-create-form')).toBeInTheDocument()

    // Check for ingredient table
    expect(screen.getByTestId('ingredient-table')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<IngredientsPage />)

    // Check for sections with correct classes
    const sections = screen.getAllByTestId(/section/)
    sections.forEach((section) => {
      expect(section).toHaveClass(
        'border-1',
        'm-2',
        'w-full',
        'rounded',
        'border-solid',
        'border-black',
        'bg-slate-50',
        'p-3',
        'shadow-md'
      )
    })
  })
})
