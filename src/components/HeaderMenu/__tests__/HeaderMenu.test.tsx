import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import React from 'react'
import HeaderMenu from '../HeaderMenu'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('HeaderMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all navigation links', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<HeaderMenu />)

    expect(screen.getByText('Ingredients')).toBeInTheDocument()
    expect(screen.getByText('Meals Ingredients')).toBeInTheDocument()
    expect(screen.getByText('🥕')).toBeInTheDocument()
    expect(screen.getByText('🍱')).toBeInTheDocument()
  })

  it('applies active class to Ingredients link when on /ingredients path', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/ingredients')
    render(<HeaderMenu />)

    const ingredientsLink = screen.getByRole('link', { name: '🥕 Ingredients' })
    const mealsLink = screen.getByRole('link', { name: '🍱 Meals Ingredients' })

    expect(ingredientsLink).toHaveClass('btn-active')
    expect(mealsLink).not.toHaveClass('btn-active')
  })

  it('applies active class to Meals Ingredients link when on /meals path', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/meals')
    render(<HeaderMenu />)

    const ingredientsLink = screen.getByRole('link', { name: '🥕 Ingredients' })
    const mealsLink = screen.getByRole('link', { name: '🍱 Meals Ingredients' })

    expect(mealsLink).toHaveClass('btn-active')
    expect(ingredientsLink).not.toHaveClass('btn-active')
  })

  it('has correct href attributes for navigation links', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<HeaderMenu />)

    const ingredientsLink = screen.getByRole('link', { name: '🥕 Ingredients' })
    const mealsLink = screen.getByRole('link', { name: '🍱 Meals Ingredients' })

    expect(ingredientsLink).toHaveAttribute('href', '/ingredients')
    expect(mealsLink).toHaveAttribute('href', '/')
  })

  it('applies btn class to all links', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<HeaderMenu />)

    const ingredientsLink = screen.getByRole('link', { name: '🥕 Ingredients' })
    const mealsLink = screen.getByRole('link', { name: '🍱 Meals Ingredients' })

    expect(ingredientsLink).toHaveClass('btn')
    expect(mealsLink).toHaveClass('btn')
  })
})
