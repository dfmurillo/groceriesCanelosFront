import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createCategory } from '@/actions/categoryActions'
import NewCategoryForm from '../NewCategoryForm'

// Mock the category actions
jest.mock('@/actions/categoryActions', () => ({
  createCategory: jest.fn(),
}))

// Mock the UI components
jest.mock('@/components/UI/FormElements/Button', () => ({
  __esModule: true,
  default: ({ label, buttonProps }: any) => (
    <button {...buttonProps} data-testid='submit-button'>
      {label}
    </button>
  ),
  ButtonActionEnum: {
    SAVE: 'save',
  },
}))

jest.mock('@/components/UI/FormElements/ButtonHolder', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid='button-holder'>{children}</div>,
}))

jest.mock('@/components/UI/FormElements/InputText', () => {
  const React = require('react')
  const MockInputText = React.forwardRef((props: any, ref: React.Ref<any>) => {
    const [error, setError] = React.useState('')
    React.useImperativeHandle(ref, () => ({
      setError,
    }))
    return (
      <div>
        <label>{props.labelText}</label>
        <input {...props.inputProps} data-testid='category-input' />
        {error && (
          <div>
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  })
  MockInputText.displayName = 'MockInputText'
  return {
    __esModule: true,
    default: MockInputText,
  }
})

jest.mock('@/components/UI/Toast/Toast', () => {
  return {
    __esModule: true,
    default: ({ ref }: any) => <div data-testid='toast' ref={ref} />,
  }
})

describe('NewCategoryForm', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the form with all elements', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <NewCategoryForm />
      </QueryClientProvider>
    )

    expect(screen.getByText('Category Name:')).toBeInTheDocument()
    expect(screen.getByTestId('category-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    expect(screen.getByTestId('toast')).toBeInTheDocument()
  })

  it('submits the form with valid data', async () => {
    const mockCategory = { id: '1', name: 'Test Category' }
    ;(createCategory as jest.Mock).mockResolvedValueOnce(mockCategory)

    render(
      <QueryClientProvider client={queryClient}>
        <NewCategoryForm />
      </QueryClientProvider>
    )

    const input = screen.getByTestId('category-input')
    const submitButton = screen.getByTestId('submit-button')

    fireEvent.change(input, { target: { value: 'Test Category' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({ name: 'Test Category' })
    })
  })

  it('shows validation error for empty category name', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <NewCategoryForm />
      </QueryClientProvider>
    )

    const submitButton = screen.getByTestId('submit-button')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Category name is required')).toBeInTheDocument()
    })
  })

  it('disables submit button while submitting', async () => {
    const mockCategory = { id: '1', name: 'Test Category' }
    ;(createCategory as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockCategory), 100))
    )

    render(
      <QueryClientProvider client={queryClient}>
        <NewCategoryForm />
      </QueryClientProvider>
    )

    const input = screen.getByTestId('category-input')
    const submitButton = screen.getByTestId('submit-button')

    fireEvent.change(input, { target: { value: 'Test Category' } })
    fireEvent.click(submitButton)

    expect(submitButton).toHaveTextContent('Saving...')
    expect(submitButton).toBeDisabled()

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Save')
    })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })
})
