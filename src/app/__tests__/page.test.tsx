import { render, screen } from '@testing-library/react'
import Web from '../page'

describe('Web', () => {
  it('renders the web page with expected content', () => {
    render(<Web />)
    expect(screen.getByText('Holi ii ii')).toBeInTheDocument()
  })
})
