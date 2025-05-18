import { fireEvent, render, screen } from '@testing-library/react'
import ActionButton from '../ActionButton'

// Mock dialog element methods
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})

describe('ActionButton', () => {
  it('renders button with default props', () => {
    render(
      <ActionButton textButton='Add New'>
        <div>Modal Content</div>
      </ActionButton>
    )

    const button = screen.getByRole('button', { name: /add new/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn-success')
  })

  it('renders button with custom color and size', () => {
    render(
      <ActionButton textButton='Add New' buttonColor='ghost' buttonSize='xs'>
        <div>Modal Content</div>
      </ActionButton>
    )

    const button = screen.getByRole('button', { name: /add new/i })
    expect(button).toHaveClass('btn-ghost')
    expect(button).toHaveClass('btn-xs')
  })

  it('renders button with prefix icon', () => {
    render(
      <ActionButton textButton='Add New' buttonPrefixIcon='+'>
        <div>Modal Content</div>
      </ActionButton>
    )

    const button = screen.getByRole('button', { name: /\+ add new/i })
    expect(button).toBeInTheDocument()
  })

  it('opens modal when button is clicked', () => {
    render(
      <ActionButton textButton='Add New'>
        <div>Modal Content</div>
      </ActionButton>
    )

    const button = screen.getByRole('button', { name: /add new/i })
    fireEvent.click(button)

    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('modal')
  })

  it('renders modal with custom title', () => {
    render(
      <ActionButton textButton='Add New' textTitle='Custom Title'>
        <div>Modal Content</div>
      </ActionButton>
    )

    const button = screen.getByRole('button', { name: /add new/i })
    fireEvent.click(button)

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('renders modal with default title when textTitle is not provided', () => {
    render(
      <ActionButton textButton='Add New'>
        <div>Modal Content</div>
      </ActionButton>
    )

    const button = screen.getByRole('button', { name: /add new/i })
    fireEvent.click(button)

    expect(screen.getByTestId('modal-title')).toHaveTextContent('Add New')
  })

  it('renders modal content', () => {
    render(
      <ActionButton textButton='Add New'>
        <div data-testid='modal-content'>Modal Content</div>
      </ActionButton>
    )

    const button = screen.getByRole('button', { name: /add new/i })
    fireEvent.click(button)

    expect(screen.getByTestId('modal-content')).toBeInTheDocument()
  })
})
