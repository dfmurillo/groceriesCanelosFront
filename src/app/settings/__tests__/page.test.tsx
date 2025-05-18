import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import SettingsPage from '../page'

// Mock the components that use React Query
jest.mock('@/components/Categories/CategoriesTable', () => {
  return function MockCategoriesTable() {
    return <div data-testid='categories-table'>Categories Table</div>
  }
})

jest.mock('@/components/Categories/NewCategoryForm', () => {
  return function MockNewCategoryForm() {
    return <div data-testid='new-category-form'>New Category Form</div>
  }
})

describe('SettingsPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  it('renders the settings page with expected elements', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SettingsPage />
      </QueryClientProvider>
    )
    expect(screen.getByText('Categories and Tags')).toBeInTheDocument()
    expect(screen.getByText('New Category')).toBeInTheDocument()
    expect(screen.getByTestId('categories-table')).toBeInTheDocument()
    expect(screen.getByTestId('new-category-form')).toBeInTheDocument()
  })
})
