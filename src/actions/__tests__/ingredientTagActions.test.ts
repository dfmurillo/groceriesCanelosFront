import axios from 'axios'
import {
  IngredientTagsCreateResponseType,
  IngredientTagsCreateType
} from '@/schemas/IngredientTag/IngredientTag.type'
import { env } from 'env.mjs'
import { createIngredientTag, deleteIngredientTag } from '../ingredientTagActions'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock environment variables
jest.mock('env.mjs', () => ({
  env: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: 'http://test-api.com'
  }
}))

describe('Ingredient Tag Actions', () => {
  const mockIngredientTagResponse: IngredientTagsCreateResponseType = {
    id: 1,
    ingredient: { id: 1 },
    tag: { id: 2 }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createIngredientTag', () => {
    const createData: IngredientTagsCreateType = {
      ingredientId: 1,
      tagId: 2
    }

    it('should create ingredient tag successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockIngredientTagResponse })

      const result = await createIngredientTag(createData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredient-tags/`,
        {
          ingredient: createData.ingredientId,
          tag: createData.tagId
        }
      )
      expect(result).toEqual(mockIngredientTagResponse)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.post.mockResolvedValueOnce({ data: invalidData })

      await expect(createIngredientTag(createData)).rejects.toThrow(
        'error with response structure on createIngredientTag'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(createIngredientTag(createData)).rejects.toThrow('API Error')
    })
  })

  describe('deleteIngredientTag', () => {
    it('should delete ingredient tag successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({})

      await deleteIngredientTag(1)

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/ingredient-tags/1`
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.delete.mockRejectedValueOnce(error)

      await expect(deleteIngredientTag(1)).rejects.toThrow('API Error')
    })
  })
}) 