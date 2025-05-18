import { render, screen } from '@testing-library/react'
import React from 'react'
import MenusPage from '../page'

// Mock environment variables
jest.mock('process', () => ({
  env: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: 'http://localhost:3000',
  },
}))

// Mock the components inline
jest.mock('@/app/actions', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/components/Categories/ActionButton', () => ({
  __esModule: true,
  default: ({ children, textButton }: any) => (
    <div data-testid='action-button'>
      {textButton}
      {children}
    </div>
  ),
}))

jest.mock('@/components/MenuCreateEdit/MenuCreateEditForm', () => ({
  __esModule: true,
  default: () => <div data-testid='menu-create-edit-form' />,
}))

jest.mock('@/components/MenuGrid/MenuTile', () => ({
  __esModule: true,
  default: ({ menu }: any) => <div data-testid='menu-tile'>{menu?.name}</div>,
}))

jest.mock('@/components/UI/FormElements/DataList', () => ({
  __esModule: true,
  default: ({ listOptions }: any) => <div data-testid='data-list'>{listOptions?.join(',')}</div>,
}))

// Mock validateSchema
const mockValidateSchema = jest.fn()
jest.mock('@/utils/validateSchema', () => ({
  validateSchema: (...args: any[]) => mockValidateSchema(...args),
}))

const mockMenus = [
  {
    id: 1,
    name: 'Menu 1',
    menuIngredient: [{ ingredientQuantityType: 'g' }, { ingredientQuantityType: 'ml' }],
  },
  {
    id: 2,
    name: 'Menu 2',
    menuIngredient: [{ ingredientQuantityType: 'g' }],
  },
]

describe('MenusPage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    // Reset fetch mock
    global.fetch = jest.fn()
  })

  it('renders menus and datalist', async () => {
    // Mock successful fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMenus,
    })
    mockValidateSchema.mockReturnValue(true)

    render(await MenusPage())

    // Check for action button
    expect(screen.getByTestId('action-button')).toBeInTheDocument()
    expect(screen.getByText('New Menu')).toBeInTheDocument()

    // Check for menu create form
    expect(screen.getByTestId('menu-create-edit-form')).toBeInTheDocument()

    // Check for menu tiles
    const tiles = screen.getAllByTestId('menu-tile')
    expect(tiles).toHaveLength(2)
    expect(tiles[0]).toHaveTextContent('Menu 1')
    expect(tiles[1]).toHaveTextContent('Menu 2')

    // Check for data list
    expect(screen.getByTestId('data-list')).toHaveTextContent('g,ml')
  })

  it('throws error if fetch fails', async () => {
    // Mock failed fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    })
    mockValidateSchema.mockReturnValue(true)

    await expect(MenusPage()).rejects.toThrow('Failed to fetch data')
  })

  it('throws error if schema validation fails', async () => {
    // Mock successful fetch but failed validation
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMenus,
    })
    mockValidateSchema.mockReturnValue(false)

    await expect(MenusPage()).rejects.toThrow('Invalid Menus data')
  })
})
