import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useFilterContext } from '@/contexts/FilterContextProvider'
import FilterList from '../FilterList'

// Mock the FilterContext
jest.mock('@/contexts/FilterContextProvider', () => ({
  useFilterContext: jest.fn(),
}))

describe('FilterList', () => {
  const mockFilterData = {
    id: 1,
    name: 'Test Category',
    categoryTags: [
      { id: 1, name: 'Tag 1' },
      { id: 2, name: 'Tag 2' },
    ],
  }

  const mockFilter = {
    1: [{ tagId: 1, tagName: 'Tag 1' }],
  }

  const mockSetFilter = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFilterContext as jest.Mock).mockReturnValue({
      filter: mockFilter,
      setFilter: mockSetFilter,
    })
  })

  it('renders category name and dropdown', () => {
    render(<FilterList filterData={mockFilterData} />)

    expect(screen.getByText('Test Category ▾')).toBeInTheDocument()
    // Check for Tag 1 in the dropdown list
    expect(screen.getByRole('button', { name: 'Tag 1' })).toBeInTheDocument()
    // Check for Tag 2 in the dropdown list
    expect(screen.getByRole('button', { name: 'Tag 2' })).toBeInTheDocument()
  })

  it('shows active filters as badges', () => {
    render(<FilterList filterData={mockFilterData} />)

    // Tag 1 should be shown as a badge since it's in the filter
    const tag1Badge = screen.getByText('Tag 1', { selector: '.badge' })
    expect(tag1Badge).toBeInTheDocument()
    expect(tag1Badge).toHaveClass('badge')

    // Tag 2 should not be shown as a badge since it's not in the filter
    const tag2Button = screen.getByRole('button', { name: 'Tag 2' })
    expect(tag2Button).not.toHaveClass('badge')
  })

  it('adds tag to filter when clicked', () => {
    render(<FilterList filterData={mockFilterData} />)

    // Click on Tag 2 to add it to the filter
    const tag2Button = screen.getByRole('button', { name: 'Tag 2' })
    fireEvent.click(tag2Button)

    expect(mockSetFilter).toHaveBeenCalledWith({
      1: [
        { tagId: 1, tagName: 'Tag 1' },
        { tagId: 2, tagName: 'Tag 2' },
      ],
    })
  })

  it('removes tag from filter when badge is clicked', () => {
    render(<FilterList filterData={mockFilterData} />)

    // Find and click the close button on the Tag 1 badge
    const closeButton = screen.getByRole('button', { name: '' }) // The SVG button
    fireEvent.click(closeButton)

    expect(mockSetFilter).toHaveBeenCalledWith({
      1: [], // Tag 1 should be removed
    })
  })

  it('handles empty category tags', () => {
    const emptyFilterData = {
      ...mockFilterData,
      categoryTags: [],
    }

    render(<FilterList filterData={emptyFilterData} />)

    expect(screen.getByText('Test Category ▾')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tag 1' })).not.toBeInTheDocument()
  })

  it('handles empty filter state', () => {
    ;(useFilterContext as jest.Mock).mockReturnValue({
      filter: {},
      setFilter: mockSetFilter,
    })

    render(<FilterList filterData={mockFilterData} />)

    expect(screen.getByText('Test Category ▾')).toBeInTheDocument()
    expect(screen.queryByText('Tag 1', { selector: '.badge' })).not.toBeInTheDocument()
    expect(screen.queryByText('Tag 2', { selector: '.badge' })).not.toBeInTheDocument()
  })
})
