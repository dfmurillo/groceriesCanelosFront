import axios from 'axios'
import { MenuCreateResponseType, MenuCreateType, MenuType, MenuUpdateType } from '@/schemas/Menu/Menu.type'
import { env } from 'env.mjs'
import { createMenu, deleteMenu, updateMenu } from '../menuActions'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock environment variables
jest.mock('env.mjs', () => ({
  env: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: 'http://test-api.com'
  }
}))

describe('Menu Actions', () => {
  const mockMenu: MenuType = {
    id: 1,
    name: 'Test Menu',
    menuPax: 4,
    detail: 'Test Detail'
  }

  const mockCreateMenuResponse: MenuCreateResponseType = {
    id: 1,
    name: 'Test Menu',
    menuPax: 4,
    detail: 'Test Detail',
    user: 1
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createMenu', () => {
    const createData: MenuCreateType = {
      name: 'New Menu',
      menuPax: 2,
      detail: 'New Detail'
    }

    it('should create menu successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockCreateMenuResponse })

      const result = await createMenu(createData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/`,
        createData
      )
      expect(result).toEqual(mockCreateMenuResponse)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.post.mockResolvedValueOnce({ data: invalidData })

      await expect(createMenu(createData)).rejects.toThrow(
        'Invalid Created Menu data'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(createMenu(createData)).rejects.toThrow('API Error')
    })
  })

  describe('updateMenu', () => {
    const updateData: MenuUpdateType = {
      id: 1,
      name: 'Updated Menu',
      menuPax: 6,
      detail: 'Updated Detail'
    }

    it('should update menu successfully', async () => {
      const updatedMenu = { ...mockMenu, ...updateData }
      mockedAxios.patch.mockResolvedValueOnce({ data: updatedMenu })

      const result = await updateMenu(updateData)

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/${updateData.id}`,
        {
          name: updateData.name,
          menuPax: updateData.menuPax,
          detail: updateData.detail
        }
      )
      expect(result).toEqual(updatedMenu)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.patch.mockResolvedValueOnce({ data: invalidData })

      await expect(updateMenu(updateData)).rejects.toThrow(
        'error with response structure while updating the menu'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.patch.mockRejectedValueOnce(error)

      await expect(updateMenu(updateData)).rejects.toThrow('API Error')
    })
  })

  describe('deleteMenu', () => {
    it('should delete menu successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({})

      await deleteMenu(1)

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menus/1`
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.delete.mockRejectedValueOnce(error)

      await expect(deleteMenu(1)).rejects.toThrow('API Error')
    })
  })
}) 