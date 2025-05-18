import { render, screen } from '@testing-library/react'
import menuError from '../error'

describe('menuError', () => {
  it('renders the error message and structure', () => {
    const error = new Error('Something went wrong')
    render(menuError({ error }))

    // Check for error message
    const errorMessage = screen.getByText('Something went wrong')
    expect(errorMessage).toBeInTheDocument()

    // Check for heading with correct classes
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-5xl', 'font-bold')
    expect(heading).toHaveTextContent('Something went wrong')

    // Check for container structure using data-testid
    const container = screen.getByTestId('error-container')
    expect(container).toHaveClass('hero', 'min-h-screen', 'bg-base-200')
  })
})
