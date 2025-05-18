import axios from 'axios'
import {
  MenuIngredientCreateResponseType,
  MenuIngredientCreateType,
  MenuIngredientUpdateResponseType,
  MenuIngredientUpdateType
} from '@/schemas/MenuIngredient/MenuIngredient.type'
import { env } from 'env.mjs'
import { createMenuIngredients, deleteMenuIngredients, updateMenuIngredients } from '../menuIngredientsActions'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock environment variables
jest.mock('env.mjs', () => ({
  env: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: 'http://test-api.com'
  }
}))

describe('Menu Ingredients Actions', () => {
  const mockMenuIngredient: MenuIngredientCreateResponseType = [{
    ingredientQuantity: 2,
    ingredientQuantityType: 'kg',
    ingredient: {
      id: 1
    },
    menu: {
      id: 1
    }
  }]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createMenuIngredients', () => {
    const createData: MenuIngredientCreateType[] = [
      {
        menu: 1,
        ingredient: 1,
        ingredientQuantity: 2,
        ingredientQuantityType: 'kg'
      }
    ]

    it('should create menu ingredients successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockMenuIngredient })

      const result = await createMenuIngredients(createData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menu-ingredients/`,
        createData
      )
      expect(result).toEqual(mockMenuIngredient)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.post.mockResolvedValueOnce({ data: invalidData })

      await expect(createMenuIngredients(createData)).rejects.toThrow(
        'Invalid menu ingredients list data'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(createMenuIngredients(createData)).rejects.toThrow('API Error')
    })
  })

  describe('updateMenuIngredients', () => {
    const updateData: MenuIngredientUpdateType = {
      id: 1,
      ingredientQuantity: 3,
      ingredientQuantityType: 'g'
    }

    const mockUpdateResponse: MenuIngredientUpdateResponseType = {
      id: 1,
      ingredientQuantity: 3,
      ingredientQuantityType: 'g'
    }

    it('should update menu ingredients successfully', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: mockUpdateResponse })

      const result = await updateMenuIngredients(updateData)

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menu-ingredients/${updateData.id}`,
        {
          ingredientQuantity: updateData.ingredientQuantity,
          ingredientQuantityType: updateData.ingredientQuantityType
        }
      )
      expect(result).toEqual(mockUpdateResponse)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.patch.mockResolvedValueOnce({ data: invalidData })

      await expect(updateMenuIngredients(updateData)).rejects.toThrow(
        'error with response structure while updating the menu ingredients'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.patch.mockRejectedValueOnce(error)

      await expect(updateMenuIngredients(updateData)).rejects.toThrow('API Error')
    })
  })

  describe('deleteMenuIngredients', () => {
    it('should delete menu ingredients successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({})

      await deleteMenuIngredients(1)

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/menu-ingredients/1`
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.delete.mockRejectedValueOnce(error)

      await expect(deleteMenuIngredients(1)).rejects.toThrow('API Error')
    })
  })
}) 