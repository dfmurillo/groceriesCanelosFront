import { useMutation, useQueryClient } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React, { forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { deleteIngredient, updateIngredient } from '@/actions/ingredientActions'
import IngredientNameBadge from '../IngredientNameBadge'

// Mock HTMLDialogElement methods
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}))

// Mock @hookform/resolvers/zod
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}))

// Mock the actions
jest.mock('@/actions/ingredientActions', () => ({
  deleteIngredient: jest.fn(),
  updateIngredient: jest.fn(),
}))

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

// Mock ActionButton component
jest.mock('@/components/Categories/ActionButton', () => {
  return function MockActionButton({ children, textButton }: { children: React.ReactNode; textButton: string }) {
    return (
      <div data-testid='action-button'>
        <button type='button'>{textButton}</button>
        {children}
      </div>
    )
  }
})

// Mock AlertDelete component
const mockSetVisibility = jest.fn()
jest.mock('@/components/UI/Alert/AlertDelete', () => {
  const MockAlertDelete = forwardRef(
    ({ handleAction, alertText }: { handleAction: Function; alertText: string }, ref) => {
      useImperativeHandle(ref, () => ({
        setVisibility: mockSetVisibility,
      }))
      return (
        <div data-testid='alert-delete'>
          <span data-testid='alert-text'>{alertText}</span>
          <button data-testid='alert-cancel'>Cancel</button>
          <button data-testid='alert-confirm' onClick={() => handleAction()}>
            I&apos;m sure
          </button>
        </div>
      )
    }
  )
  MockAlertDelete.displayName = 'MockAlertDelete'
  return MockAlertDelete
})

// Mock InputText component
const mockSetError = jest.fn()
jest.mock('@/components/UI/FormElements/InputText', () => {
  const MockInputText = forwardRef(({ labelText, inputProps }: any, ref) => {
    useImperativeHandle(ref, () => ({
      setError: mockSetError,
    }))
    return (
      <label data-testid='input-text-label'>
        {labelText}
        <input {...inputProps} data-testid='input-text-field' />
      </label>
    )
  })
  MockInputText.displayName = 'MockInputText'
  return MockInputText
})

describe('IngredientNameBadge', () => {
  const mockQueryClient = {
    setQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  }

  const mockMutate = jest.fn()
  const mockSetError = jest.fn()
  const mockSetMessage = jest.fn()
  const mockSetVisibility = jest.fn()
  const mockHandleSubmit = jest.fn()
  const mockRegister = jest.fn()
  const mockSetFocus = jest.fn()

  // Define ref implementations
  const refImplementations = [
    { setError: mockSetError }, // ingredientFieldRef
    { setMessage: mockSetMessage }, // toastRef
    { setVisibility: mockSetVisibility }, // alertDeleteRef
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQueryClient as jest.Mock).mockReturnValue(mockQueryClient)
    ;(useMutation as jest.Mock).mockImplementation(({ mutationFn, onSuccess, onError }) => ({
      mutate: async (data: any) => {
        try {
          const result = await mutationFn(data)
          onSuccess(result, data)
        } catch (error) {
          onError(error)
        }
      },
      isPending: false,
    }))

    // Mock useForm
    ;(useForm as jest.Mock).mockReturnValue({
      setFocus: mockSetFocus,
      register: jest.fn((field) => ({
        name: field,
        value: field === 'name' ? 'Test Ingredient' : 1,
      })),
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault()
        fn({ name: 'Updated Ingredient', id: 1 })
      },
      formState: { isSubmitting: false, errors: {} },
    })

    // Mock refs using array of implementations
    let refIndex = 0
    jest.spyOn(React, 'useRef').mockImplementation(() => ({
      current: refImplementations[refIndex++] || null,
    }))
  })

  it('renders the ingredient name as a button', () => {
    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)
    expect(screen.getByRole('button', { name: /test ingredient/i })).toBeInTheDocument()
  })

  it('shows form with input and buttons when clicked', async () => {
    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)

    const button = screen.getByRole('button', { name: /test ingredient/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('updates ingredient name on form submission', async () => {
    const mockUpdatedIngredient = { id: 1, name: 'Updated Ingredient' }
    ;(updateIngredient as jest.Mock).mockResolvedValue(mockUpdatedIngredient)

    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)

    const button = screen.getByRole('button', { name: /test ingredient/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    })

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Edit' })

    fireEvent.change(input, { target: { value: 'Updated Ingredient' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(updateIngredient).toHaveBeenCalledWith({ id: 1, name: 'Updated Ingredient' })
    })
  })

  it('shows loading state during update', async () => {
    ;(useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    })
    ;(useForm as jest.Mock).mockReturnValue({
      setFocus: mockSetFocus,
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: { isSubmitting: true, errors: {} },
    })

    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)

    const button = screen.getByRole('button', { name: /test ingredient/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Editing...' })).toBeInTheDocument()
  })

  it('handles update error', async () => {
    const errorMessage = 'Failed to update ingredient'
    ;(updateIngredient as jest.Mock).mockRejectedValue(new Error(errorMessage))

    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)

    const button = screen.getByRole('button', { name: /test ingredient/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    })

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Edit' })

    fireEvent.change(input, { target: { value: 'Updated Ingredient' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(updateIngredient).toHaveBeenCalledWith({ id: 1, name: 'Updated Ingredient' })
    })
  })

  it('shows delete confirmation dialog', async () => {
    // Reset all mocks before the test
    jest.clearAllMocks()

    // Mock all refs with proper types
    type RefType = React.MutableRefObject<{ setError?: jest.Mock; setMessage?: jest.Mock; setVisibility?: jest.Mock }>
    const mockRefs: RefType[] = [
      { current: { setError: jest.fn() } },
      { current: { setMessage: jest.fn() } },
      { current: { setVisibility: jest.fn() } },
    ]

    // Mock useRef to return our refs in sequence
    let refIndex = 0
    jest.spyOn(React, 'useRef').mockImplementation(() => mockRefs[refIndex++] as React.MutableRefObject<unknown>)

    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)

    const button = screen.getByRole('button', { name: /test ingredient/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)

    // Wait for and verify the delete confirmation dialog was shown
    await waitFor(() => {
      expect(mockRefs[2]!.current.setVisibility).toHaveBeenCalledWith(true)
    })
  })

  it('deletes ingredient on confirmation', async () => {
    // Mock the delete function to return a successful response
    ;(deleteIngredient as jest.Mock).mockResolvedValue({ id: 1, name: 'Test Ingredient' })

    // Mock the mutation following IngredientCreateForm pattern
    const mockMutation = {
      mutate: jest.fn(),
      isPending: false,
    }
    ;(useMutation as jest.Mock).mockReturnValue({
      ...mockMutation,
      onSuccess: (data: any) => {
        mockQueryClient.setQueryData(['ingredients'], (oldIngredients: any) =>
          oldIngredients.filter(({ id }: { id: number }) => id !== data.id)
        )
        mockQueryClient.invalidateQueries({
          queryKey: ['ingredients'],
        })
        mockSetMessage('The ingredient was deleted')
      },
    })

    // Render the component
    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)

    // Click the main button to show the form
    const mainButton = screen.getByRole('button', { name: 'Test Ingredient' })
    expect(mainButton).toBeInTheDocument()
    fireEvent.click(mainButton)

    // Wait for the form to be visible and verify its elements
    await waitFor(() => {
      expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    })

    // Find and verify the delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    expect(deleteButton).toBeInTheDocument()
    expect(deleteButton).not.toBeDisabled()

    // Click the delete button
    fireEvent.click(deleteButton)

    // Wait for and verify the delete confirmation dialog was shown
    await waitFor(() => {
      expect(mockSetVisibility).toHaveBeenCalledWith(true)
    })

    // Simulate the delete confirmation
    await mockMutation.mutate(1)

    // Verify the delete was called with correct ID
    expect(deleteIngredient).toHaveBeenCalledWith(1)

    // Verify success message was shown
    expect(mockSetMessage).toHaveBeenCalledWith('The ingredient was deleted')
  })

  it.only('updates query cache on successful update', async () => {
    const mockUpdatedIngredient = { id: 1, name: 'Updated Ingredient' }
    const mockOldIngredients = [{ id: 1, name: 'Test Ingredient' }]

    // Mock updateIngredient to return the updated ingredient
    ;(updateIngredient as jest.Mock).mockImplementation(async (data) => {
      expect(data).toEqual({ id: 1, name: 'Updated Ingredient' })
      return mockUpdatedIngredient
    })

    // Create mock functions for refs
    const mockSetError = jest.fn()
    const mockSetMessage = jest.fn()
    const mockSetVisibility = jest.fn()

    // Mock all refs with proper types
    type RefType = React.MutableRefObject<{ setError?: jest.Mock; setMessage?: jest.Mock; setVisibility?: jest.Mock }>
    const mockRefs: RefType[] = [
      { current: { setError: mockSetError } },
      { current: { setMessage: mockSetMessage } },
      { current: { setVisibility: mockSetVisibility } },
    ]

    // Mock useRef to return our refs in sequence
    let refIndex = 0
    jest.spyOn(React, 'useRef').mockImplementation(() => mockRefs[refIndex++] as React.MutableRefObject<unknown>)

    // Mock the mutation with proper callbacks
    const mockMutation = {
      mutate: jest.fn().mockImplementation(async (data) => {
        const result = await updateIngredient(data)
        return result
      }),
      isPending: false,
    }
    ;(useMutation as jest.Mock).mockImplementation(({ mutationFn, onSuccess }) => {
      return {
        ...mockMutation,
        onSuccess: (data: any, variables: any) => {
          onSuccess(data, variables)
        },
      }
    })

    mockQueryClient.setQueryData.mockImplementation((key, callback) => {
      if (typeof callback === 'function') {
        return callback(mockOldIngredients)
      }
      return mockOldIngredients
    })

    render(<IngredientNameBadge ingredientId={1} ingredientName='Test Ingredient' />)

    const button = screen.getByRole('button', { name: /test ingredient/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    })

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Edit' })

    fireEvent.change(input, { target: { value: 'Updated Ingredient' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(updateIngredient).toHaveBeenCalledWith({ id: 1, name: 'Updated Ingredient' })
    })

    expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(['ingredients'], expect.any(Function))
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['ingredients'],
    })
    expect(mockSetMessage).toHaveBeenCalledWith('The category was updated')
  })
})
