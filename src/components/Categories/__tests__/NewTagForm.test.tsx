import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { createTag } from '@/actions/tagActions'
import NewTagForm from '../NewTagForm'

// Mock React Query hooks
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

// Mock React Hook Form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}))

// Mock tag actions
jest.mock('@/actions/tagActions', () => ({
  createTag: jest.fn(),
}))

// Mock UI components
jest.mock('../../UI/FormElements/InputText', () => {
  const Mock = React.forwardRef(({ labelText, inputProps }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      setError: jest.fn(),
    }))
    return (
      <div>
        {labelText && <label>{labelText}</label>}
        <input {...inputProps} ref={ref} />
      </div>
    )
  })
  Mock.displayName = 'MockInputText'
  return Mock
})

jest.mock('../../UI/FormElements/Button', () => {
  const Mock = ({ label, buttonProps }: any) => <button {...buttonProps}>{label}</button>
  Mock.displayName = 'MockButton'
  return {
    __esModule: true,
    default: Mock,
    ButtonActionEnum: {
      SAVE: 'save',
    },
  }
})

jest.mock('../../UI/FormElements/ButtonHolder', () => {
  const Mock = ({ children }: any) => <div>{children}</div>
  Mock.displayName = 'MockButtonHolder'
  return Mock
})

jest.mock('../../UI/Toast/Toast', () => {
  const Mock = React.forwardRef((props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      setMessage: jest.fn(),
    }))
    return <div data-testid='toast' />
  })
  Mock.displayName = 'MockToast'
  return Mock
})

describe('NewTagForm', () => {
  const mockCategoryId = 1
  const mockCategoryName = 'Test Category'
  const mockNewTag = [{ id: 1, name: 'New Tag' }]

  const mockSetQueryData = jest.fn()
  const mockInvalidateQueries = jest.fn()
  const mockQueryClient = {
    setQueryData: mockSetQueryData,
    invalidateQueries: mockInvalidateQueries,
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useQueryClient
    ;(useQueryClient as jest.Mock).mockReturnValue(mockQueryClient)

    // Mock useForm
    ;(useForm as jest.Mock).mockReturnValue({
      register: jest.fn((field) => ({
        name: field,
        value: field === 'name' ? '' : mockCategoryId,
      })),
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault()
        fn({ name: 'New Tag', categoryId: mockCategoryId })
      },
      formState: { isSubmitting: false, errors: {} },
      setFocus: jest.fn(),
      reset: jest.fn(),
    })

    // Mock mutations
    ;(useMutation as jest.Mock).mockImplementation(({ mutationFn, onSuccess, onError }) => ({
      mutate: async (data: any) => {
        try {
          const result = await mutationFn(data)
          onSuccess(result, data)
        } catch (error) {
          onError(error)
        }
      },
    }))
  })

  it('renders form elements correctly', () => {
    render(<NewTagForm categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    expect(screen.getByText(`for ${mockCategoryName}.`)).toBeInTheDocument()
    expect(screen.getByText('Tag Name:')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tag Name')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('handles tag creation successfully', async () => {
    ;(createTag as jest.Mock).mockResolvedValueOnce(mockNewTag)

    render(<NewTagForm categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(createTag).toHaveBeenCalledWith({
        name: 'New Tag',
        categoryId: mockCategoryId,
      })
    })

    await waitFor(() => {
      expect(mockSetQueryData).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['categories'],
      })
    })
  })

  it('handles creation error', async () => {
    const errorMessage = 'Creation failed'
    ;(createTag as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<NewTagForm categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(createTag).toHaveBeenCalled()
    })
  })

  it('shows loading state during submission', () => {
    ;(useForm as jest.Mock).mockReturnValue({
      register: jest.fn((field) => ({
        name: field,
        value: field === 'name' ? '' : mockCategoryId,
      })),
      handleSubmit: jest.fn(),
      formState: { isSubmitting: true, errors: {} },
      setFocus: jest.fn(),
      reset: jest.fn(),
    })

    render(<NewTagForm categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('resets form after successful submission', async () => {
    const mockReset = jest.fn()
    ;(useForm as jest.Mock).mockReturnValue({
      register: jest.fn((field) => ({
        name: field,
        value: field === 'name' ? '' : mockCategoryId,
      })),
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault()
        fn({ name: 'New Tag', categoryId: mockCategoryId })
      },
      formState: { isSubmitting: false, errors: {} },
      setFocus: jest.fn(),
      reset: mockReset,
    })
    ;(createTag as jest.Mock).mockResolvedValueOnce(mockNewTag)

    render(<NewTagForm categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled()
    })
  })
})
