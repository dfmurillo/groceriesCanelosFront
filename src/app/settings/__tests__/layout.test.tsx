import { render, screen } from '@testing-library/react'
import SettingsLayout from '../layout'

describe('SettingsLayout', () => {
  it('renders the settings layout with children', () => {
    const TestChild = () => <div data-testid='test-child'>Test Child</div>
    render(
      <SettingsLayout>
        <TestChild />
      </SettingsLayout>
    )
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    // Add more assertions as needed for your settings layout UI
  })
})
