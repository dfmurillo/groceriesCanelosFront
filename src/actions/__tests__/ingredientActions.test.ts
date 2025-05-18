import axios from 'axios'
import { IngredientCreateType, IngredientType, IngredientUpdateType } from '@/schemas/Ingredient/Ingredient.type'
import { env } from 'env.mjs'
import { createIngredient, deleteIngredient, getIngredientsWithTags, updateIngredient } from '../ingredientActions'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock environment variables
jest.mock('env.mjs', () => ({
  env: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: 'http://test-api.com'
  }
}))

describe('Ingredient Actions', () => {
  const mockIngredient: IngredientType = {
    id: 1,
    name: 'Test Ingredient'
  }

  const mockIngredients: IngredientType[] = [mockIngredient]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getIngredientsWithTags', () => {
    it('should fetch ingredients successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockIngredients })

      const result = await getIngredientsWithTags()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/`
      )
      expect(result).toEqual(mockIngredients)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = [{ invalid: 'data' }]
      mockedAxios.get.mockResolvedValueOnce({ data: invalidData })

      await expect(getIngredientsWithTags()).rejects.toThrow(
        'error with response structure on getIngredientsWithTags'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.get.mockRejectedValueOnce(error)

      await expect(getIngredientsWithTags()).rejects.toThrow('API Error')
    })
  })

  describe('deleteIngredient', () => {
    it('should delete ingredient successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({})

      await deleteIngredient(1)

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/1`
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.delete.mockRejectedValueOnce(error)

      await expect(deleteIngredient(1)).rejects.toThrow('API Error')
    })
  })

  describe('createIngredient', () => {
    const createData: IngredientCreateType = { name: 'New Ingredient' }

    it('should create ingredient successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockIngredients })

      const result = await createIngredient(createData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/`,
        createData
      )
      expect(result).toEqual(mockIngredients)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = [{ invalid: 'data' }]
      mockedAxios.post.mockResolvedValueOnce({ data: invalidData })

      await expect(createIngredient(createData)).rejects.toThrow(
        'error with response structure on createIngredient'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(createIngredient(createData)).rejects.toThrow('API Error')
    })
  })

  describe('updateIngredient', () => {
    const updateData: IngredientUpdateType = { id: 1, name: 'Updated Ingredient' }

    it('should update ingredient successfully', async () => {
      const updatedIngredient = { ...mockIngredient, name: updateData.name.toLowerCase() }
      mockedAxios.patch.mockResolvedValueOnce({ data: updatedIngredient })

      const result = await updateIngredient(updateData)

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredients/${updateData.id}`,
        { name: updateData.name.toLowerCase() }
      )
      expect(result).toEqual(updatedIngredient)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.patch.mockResolvedValueOnce({ data: invalidData })

      await expect(updateIngredient(updateData)).rejects.toThrow(
        'error with response structure on updateIngredient'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.patch.mockRejectedValueOnce(error)

      await expect(updateIngredient(updateData)).rejects.toThrow('API Error')
    })
  })
}) 