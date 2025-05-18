import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { deleteTag, updateTag } from '@/actions/tagActions'
import CategoriesTagBadge from '../CategoriesTagBadge'

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
  deleteTag: jest.fn(),
  updateTag: jest.fn(),
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

describe('CategoriesTagBadge', () => {
  const mockTag = {
    id: 1,
    name: 'Test Tag',
  }
  const mockCategoryId = 123

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
        value: field === 'name' ? mockTag.name : mockTag.id,
      })),
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault()
        fn({ name: 'Updated Tag', id: mockTag.id })
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

  it('renders tag name and form elements', () => {
    render(<CategoriesTagBadge tag={mockTag} categoryId={mockCategoryId} />)

    expect(screen.getByText('Test Tag')).toBeInTheDocument()
    expect(screen.getByText('Tag Name:')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tag name')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('handles tag update successfully', async () => {
    const mockUpdatedTag = { id: mockTag.id, name: 'Updated Tag' }
    ;(updateTag as jest.Mock).mockResolvedValueOnce(mockUpdatedTag)

    render(<CategoriesTagBadge tag={mockTag} categoryId={mockCategoryId} />)

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(updateTag).toHaveBeenCalledWith(mockUpdatedTag)
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

  it('handles tag deletion successfully', async () => {
    ;(deleteTag as jest.Mock).mockResolvedValueOnce(undefined)

    render(<CategoriesTagBadge tag={mockTag} categoryId={mockCategoryId} />)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    const confirmDeleteButton = screen.getByText('Confirm Delete')
    fireEvent.click(confirmDeleteButton)

    await waitFor(() => {
      expect(deleteTag).toHaveBeenCalledWith(mockTag.id)
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
    ;(updateTag as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<CategoriesTagBadge tag={mockTag} categoryId={mockCategoryId} />)

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(updateTag).toHaveBeenCalled()
    })
  })

  it('handles delete error', async () => {
    const errorMessage = 'Delete failed'
    ;(deleteTag as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<CategoriesTagBadge tag={mockTag} categoryId={mockCategoryId} />)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    const confirmDeleteButton = screen.getByText('Confirm Delete')
    fireEvent.click(confirmDeleteButton)

    await waitFor(() => {
      expect(deleteTag).toHaveBeenCalledWith(mockTag.id)
    })
  })

  it('shows loading state during submission', () => {
    ;(useForm as jest.Mock).mockReturnValue({
      register: jest.fn((field) => ({
        name: field,
        value: field === 'name' ? mockTag.name : mockTag.id,
      })),
      handleSubmit: jest.fn(),
      formState: { isSubmitting: true, errors: {} },
      setFocus: jest.fn(),
    })

    render(<CategoriesTagBadge tag={mockTag} categoryId={mockCategoryId} />)

    expect(screen.getByText('Editing...')).toBeInTheDocument()
  })
})
