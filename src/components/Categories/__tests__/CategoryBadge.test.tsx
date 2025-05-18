import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { deleteCategory, updateCategory } from '@/actions/categoryActions'
import CategoryBadge from '../CategoryBadge'

// Mock React Query hooks
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

// Mock React Hook Form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}))

// Mock category actions
jest.mock('@/actions/categoryActions', () => ({
  deleteCategory: jest.fn(),
  updateCategory: jest.fn(),
}))

// Mock ActionButton component
jest.mock('../ActionButton', () => {
  const Mock = ({ children, textButton }: any) => (
    <div data-testid='action-button'>
      <span>{textButton}</span>
      {children}
    </div>
  )
  Mock.displayName = 'MockActionButton'
  return Mock
})

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
      DELETE: 'delete',
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

jest.mock('../../UI/Alert/AlertDelete', () => {
  const Mock = React.forwardRef(({ alertText, handleAction }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      setVisibility: jest.fn(),
    }))
    return (
      <div data-testid='alert-delete'>
        <p>{alertText}</p>
        <button onClick={handleAction}>Confirm Delete</button>
      </div>
    )
  })
  Mock.displayName = 'MockAlertDelete'
  return Mock
})

describe('CategoryBadge', () => {
  const mockCategoryId = 1
  const mockCategoryName = 'Test Category'

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
        value: field === 'name' ? mockCategoryName : mockCategoryId,
      })),
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault()
        fn({ name: 'Updated Category', id: mockCategoryId })
      },
      formState: { isSubmitting: false, errors: {} },
      setFocus: jest.fn(),
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

  it('renders category name and form elements', () => {
    render(<CategoryBadge categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    expect(screen.getByText('Test Category')).toBeInTheDocument()
    expect(screen.getByText('Category Name:')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('handles category update successfully', async () => {
    const mockUpdatedCategory = { id: mockCategoryId, name: 'Updated Category' }
    ;(updateCategory as jest.Mock).mockResolvedValueOnce(mockUpdatedCategory)

    render(<CategoryBadge categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith(mockUpdatedCategory)
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

  it('handles category deletion successfully', async () => {
    ;(deleteCategory as jest.Mock).mockResolvedValueOnce(undefined)

    render(<CategoryBadge categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    const confirmDeleteButton = screen.getByText('Confirm Delete')
    fireEvent.click(confirmDeleteButton)

    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(mockCategoryId)
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

  it('handles update error', async () => {
    const errorMessage = 'Update failed'
    ;(updateCategory as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<CategoryBadge categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalled()
    })
  })

  it('handles delete error', async () => {
    const errorMessage = 'Delete failed'
    ;(deleteCategory as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<CategoryBadge categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    const confirmDeleteButton = screen.getByText('Confirm Delete')
    fireEvent.click(confirmDeleteButton)

    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(mockCategoryId)
    })
  })

  it('shows loading state during submission', () => {
    ;(useForm as jest.Mock).mockReturnValue({
      register: jest.fn((field) => ({
        name: field,
        value: field === 'name' ? mockCategoryName : mockCategoryId,
      })),
      handleSubmit: jest.fn(),
      formState: { isSubmitting: true, errors: {} },
      setFocus: jest.fn(),
    })

    render(<CategoryBadge categoryId={mockCategoryId} categoryName={mockCategoryName} />)

    expect(screen.getByText('Editing...')).toBeInTheDocument()
  })
})
