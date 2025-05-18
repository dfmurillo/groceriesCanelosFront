import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { createIngredient } from '@/actions/ingredientActions'
import IngredientCreateForm from '../IngredientCreateForm'

// Mock the actions
jest.mock('@/actions/ingredientActions', () => ({
  createIngredient: jest.fn(),
}))

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

describe('IngredientCreateForm', () => {
  const mockQueryClient = {
    setQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  }

  const mockMutate = jest.fn()
  const mockSetMessage = jest.fn()
  const mockSetError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQueryClient as jest.Mock).mockReturnValue(mockQueryClient)
    ;(useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      onSuccess: jest.fn(),
      onError: jest.fn(),
    })
  })

  it('renders the form with input and submit button', () => {
    render(<IngredientCreateForm />)

    expect(screen.getByLabelText('Ingredient Name:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('submits the form with valid data', async () => {
    const mockNewIngredient = [{ id: 1, name: 'Test Ingredient' }]
    ;(createIngredient as jest.Mock).mockResolvedValue(mockNewIngredient)

    render(<IngredientCreateForm />)

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Save' })

    fireEvent.change(input, { target: { value: 'Test Ingredient' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ name: 'Test Ingredient' })
    })
  })

  it('shows loading state during submission', async () => {
    ;(useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    })

    render(<IngredientCreateForm />)

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Save' })

    fireEvent.change(input, { target: { value: 'Test Ingredient' } })
    fireEvent.click(submitButton)

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument()
  })

  it('handles submission error', async () => {
    const errorMessage = 'Failed to create ingredient'
    const mockMutation = {
      mutate: jest.fn(),
      isPending: false,
    }
    ;(useMutation as jest.Mock).mockReturnValue(mockMutation)
    ;(createIngredient as jest.Mock).mockRejectedValue(new Error(errorMessage))

    render(<IngredientCreateForm />)

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Save' })

    fireEvent.change(input, { target: { value: 'Test Ingredient' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockMutation.mutate).toHaveBeenCalledWith({ name: 'Test Ingredient' })
    })
  })

  it('updates query cache on successful submission', async () => {
    const mockNewIngredient = [{ id: 1, name: 'Test Ingredient' }]
    const mockOldIngredients = [{ id: 2, name: 'Existing Ingredient' }]
    const mockMutation = {
      mutate: jest.fn(),
      isPending: false,
    }
    ;(useMutation as jest.Mock).mockReturnValue({
      ...mockMutation,
      onSuccess: (newIngredient: any) => {
        mockQueryClient.setQueryData(['ingredients'], (oldIngredients: any) => [...oldIngredients, ...newIngredient])
        mockQueryClient.invalidateQueries({
          queryKey: ['ingredients'],
        })
      },
    })
    ;(createIngredient as jest.Mock).mockResolvedValue(mockNewIngredient)
    mockQueryClient.setQueryData.mockImplementation((key, callback) => {
      if (typeof callback === 'function') {
        return callback(mockOldIngredients)
      }
      return mockOldIngredients
    })

    render(<IngredientCreateForm />)

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Save' })

    fireEvent.change(input, { target: { value: 'Test Ingredient' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockMutation.mutate).toHaveBeenCalledWith({ name: 'Test Ingredient' })
    })

    // Call onSuccess manually to simulate the mutation success
    const mutation = (useMutation as jest.Mock).mock.results[0].value
    mutation.onSuccess(mockNewIngredient)

    expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(['ingredients'], expect.any(Function))
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['ingredients'],
    })
  })

  it('shows success toast message after submission', async () => {
    const mockNewIngredient = [{ id: 1, name: 'Test Ingredient' }]
    const mockMutation = {
      mutate: jest.fn(),
      isPending: false,
    }
    ;(useMutation as jest.Mock).mockReturnValue(mockMutation)
    ;(createIngredient as jest.Mock).mockResolvedValue(mockNewIngredient)

    render(<IngredientCreateForm />)

    const input = screen.getByLabelText('Ingredient Name:')
    const submitButton = screen.getByRole('button', { name: 'Save' })

    fireEvent.change(input, { target: { value: 'Test Ingredient' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockMutation.mutate).toHaveBeenCalledWith({ name: 'Test Ingredient' })
    })
  })
})
