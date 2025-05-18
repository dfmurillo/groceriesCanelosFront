import { render, screen } from '@testing-library/react'
import RootLayout from '../layout'

// Mock the TanstackProvider component
jest.mock('@/contexts/TanstackProvider', () => {
  return function MockTanstackProvider({ children }: { children: React.ReactNode }) {
    return <div data-testid='tanstack-provider'>{children}</div>
  }
})

// Mock the Footer component
jest.mock('@/containers/Footer', () => {
  return function MockFooter() {
    return <footer data-testid='footer'>Footer</footer>
  }
})

// Mock the Inter font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-font-class',
    subsets: ['latin'],
  }),
}))

describe('RootLayout', () => {
  it('renders the layout with children and footer', () => {
    const TestChild = () => <div data-testid='test-child'>Test Child</div>

    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    )

    // Check if the layout structure is correct
    expect(screen.getByTestId('tanstack-provider')).toBeInTheDocument()
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
