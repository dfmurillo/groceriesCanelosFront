import { render, screen } from '@testing-library/react'
import { ButtonExample } from '../Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<ButtonExample href='/test'>Click me</ButtonExample>)

    const button = screen.getByRole('link', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/test')
    expect(button).toHaveClass('bg-blue-400') // primary intent
    expect(button).toHaveClass('text-lg') // lg size
  })

  it('renders with secondary intent', () => {
    render(
      <ButtonExample href='/test' intent='secondary'>
        Secondary Button
      </ButtonExample>
    )

    const button = screen.getByRole('link', { name: /secondary button/i })
    expect(button).toHaveClass('bg-transparent')
    expect(button).toHaveClass('text-blue-400')
  })

  it('renders with small size', () => {
    render(
      <ButtonExample href='/test' size='sm'>
        Small Button
      </ButtonExample>
    )

    const button = screen.getByRole('link', { name: /small button/i })
    expect(button).toHaveClass('text-sm')
    expect(button).toHaveClass('min-w-20')
  })

  it('renders with underline', () => {
    render(
      <ButtonExample href='/test' underline>
        Underlined Button
      </ButtonExample>
    )

    const button = screen.getByRole('link', { name: /underlined button/i })
    expect(button).toHaveClass('underline')
  })

  it('applies custom className', () => {
    render(
      <ButtonExample href='/test' className='custom-class'>
        Custom Button
      </ButtonExample>
    )

    const button = screen.getByRole('link', { name: /custom button/i })
    expect(button).toHaveClass('custom-class')
  })

  it('forwards additional props', () => {
    render(
      <ButtonExample href='/test' data-testid='test-button' aria-label='Test Button'>
        Test Button
      </ButtonExample>
    )

    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('aria-label', 'Test Button')
  })
})
