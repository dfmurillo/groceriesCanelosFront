import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { getCategoriesTags } from '@/actions/categoryActions'
import { getIngredientsWithTags } from '@/actions/ingredientActions'
import DishesLayout from '../layout'

// Mock the actions
jest.mock('@/actions/categoryActions', () => ({
  getCategoriesTags: jest.fn(),
}))

jest.mock('@/actions/ingredientActions', () => ({
  getIngredientsWithTags: jest.fn(),
}))

// Mock the components
jest.mock('@/components/HeaderMenu/HeaderMenu', () => ({
  __esModule: true,
  default: () => <div data-testid='header-menu'>Header Menu</div>,
}))

jest.mock('@/containers/Header', () => ({
  __esModule: true,
  default: ({ children, pageTitle }: any) => (
    <header data-testid='header'>
      <h1>{pageTitle}</h1>
      {children}
    </header>
  ),
}))

// Mock the context provider
jest.mock('@/contexts/FilterContextProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid='filter-context'>{children}</div>,
}))

// Mock React Query
jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query')
  return {
    ...originalModule,
    QueryClient: jest.fn().mockImplementation(() => ({
      prefetchQuery: jest.fn(),
      getQueryCache: jest.fn().mockReturnValue({
        getAll: jest.fn().mockReturnValue([]),
      }),
      mount: jest.fn(),
      unmount: jest.fn(),
    })),
    dehydrate: jest.fn().mockReturnValue({}),
  }
})

describe('DishesLayout', () => {
  const mockCategories = [{ id: 1, name: 'Category 1' }]
  const mockIngredients = [{ id: 1, name: 'Ingredient 1' }]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getCategoriesTags as jest.Mock).mockResolvedValue(mockCategories)
    ;(getIngredientsWithTags as jest.Mock).mockResolvedValue(mockIngredients)
  })

  it('renders layout with children and prefetches data', async () => {
    const TestChild = () => <div data-testid='test-child'>Test Child</div>

    render(
      <QueryClientProvider client={new QueryClient()}>
        {await DishesLayout({
          children: <TestChild />,
        })}
      </QueryClientProvider>
    )

    // Check if header is rendered with correct title
    const header = screen.getByTestId('header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveTextContent('Menus')

    // Check if header menu is rendered
    expect(screen.getByTestId('header-menu')).toBeInTheDocument()

    // Check if filter context is rendered
    expect(screen.getByTestId('filter-context')).toBeInTheDocument()

    // Check if children are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })

  it('handles data prefetching errors gracefully', async () => {
    ;(getCategoriesTags as jest.Mock).mockRejectedValue(new Error('Failed to fetch categories'))
    ;(getIngredientsWithTags as jest.Mock).mockRejectedValue(new Error('Failed to fetch ingredients'))

    const TestChild = () => <div data-testid='test-child'>Test Child</div>

    render(
      <QueryClientProvider client={new QueryClient()}>
        {await DishesLayout({
          children: <TestChild />,
        })}
      </QueryClientProvider>
    )

    // Check if the layout still renders its basic structure
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('header-menu')).toBeInTheDocument()
    expect(screen.getByTestId('filter-context')).toBeInTheDocument()
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })
})
