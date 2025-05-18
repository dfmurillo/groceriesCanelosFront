import { useQuery } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { getCategoriesTags } from '@/actions/categoryActions'
import CategoriesTable from '../CategoriesTable'

// Mock the useQuery hook
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

// Mock the getCategoriesTags action
jest.mock('@/actions/categoryActions', () => ({
  getCategoriesTags: jest.fn(),
}))

// Mock CategoriesRow component
jest.mock('../CategoriesRow', () => {
  const Mock = ({ id, name, categoryTags }: any) => (
    <tr data-testid='category-row'>
      <td data-testid='category-name'>{name}</td>
      <td data-testid='category-tags'>{categoryTags?.length || 0} tags</td>
    </tr>
  )
  Mock.displayName = 'MockCategoriesRow'
  return Mock
})

describe('CategoriesTable', () => {
  const mockCategories = [
    {
      id: 1,
      name: 'Fruits',
      categoryTags: [
        { id: 101, name: 'Citrus' },
        { id: 102, name: 'Tropical' },
      ],
    },
    {
      id: 2,
      name: 'Vegetables',
      categoryTags: [{ id: 201, name: 'Root' }],
    },
  ]

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  it('shows loading state', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(<CategoriesTable />)
    expect(screen.getByRole('status')).toHaveClass('loading-dots')
  })

  it('shows error state', () => {
    const errorMessage = 'Failed to fetch categories'
    ;(useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error(errorMessage),
    })

    render(<CategoriesTable />)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('renders table with categories when data is loaded', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    })

    render(<CategoriesTable />)

    // Check table structure
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()

    // Check if all categories are rendered
    const rows = screen.getAllByTestId('category-row')
    expect(rows).toHaveLength(2)

    // Check first category
    expect(screen.getAllByTestId('category-name')[0]).toHaveTextContent('Fruits')
    expect(screen.getAllByTestId('category-tags')[0]).toHaveTextContent('2 tags')

    // Check second category
    expect(screen.getAllByTestId('category-name')[1]).toHaveTextContent('Vegetables')
    expect(screen.getAllByTestId('category-tags')[1]).toHaveTextContent('1 tags')
  })

  it('renders empty table when no categories are available', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    render(<CategoriesTable />)

    // Table should still be present
    expect(screen.getByRole('table')).toBeInTheDocument()

    // But no rows should be rendered
    expect(screen.queryByTestId('category-row')).not.toBeInTheDocument()
  })

  it('calls getCategoriesTags with correct query key', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    })

    render(<CategoriesTable />)

    // Verify useQuery was called with correct parameters
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['categories'],
      queryFn: getCategoriesTags,
    })
  })
})
