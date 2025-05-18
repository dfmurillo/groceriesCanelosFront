import axios from 'axios'
import { CategoryCreateType, CategoryType, CategoryUpdateType } from '@/schemas/Category/Category.type'
import { env } from 'env.mjs'
import { createCategory, deleteCategory, getCategoriesTags, updateCategory } from '../categoryActions'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock environment variables
jest.mock('env.mjs', () => ({
  env: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: 'http://test-api.com'
  }
}))

describe('Category Actions', () => {
  const mockCategory: CategoryType = {
    id: 1,
    name: 'Test Category'
  }

  const mockCategories: CategoryType[] = [mockCategory]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCategoriesTags', () => {
    it('should fetch categories successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockCategories })

      const result = await getCategoriesTags()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/`
      )
      expect(result).toEqual(mockCategories)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = [{ invalid: 'data' }]
      mockedAxios.get.mockResolvedValueOnce({ data: invalidData })

      await expect(getCategoriesTags()).rejects.toThrow(
        'error with response structure on getCategoriesTags'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.get.mockRejectedValueOnce(error)

      await expect(getCategoriesTags()).rejects.toThrow('API Error')
    })
  })

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({})

      await deleteCategory(1)

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/1`
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.delete.mockRejectedValueOnce(error)

      await expect(deleteCategory(1)).rejects.toThrow('API Error')
    })
  })

  describe('createCategory', () => {
    const createData: CategoryCreateType = { name: 'New Category' }

    it('should create category successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockCategory })

      const result = await createCategory(createData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/`,
        createData
      )
      expect(result).toEqual(mockCategory)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.post.mockResolvedValueOnce({ data: invalidData })

      await expect(createCategory(createData)).rejects.toThrow(
        'error with response structure on createCategory'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(createCategory(createData)).rejects.toThrow('API Error')
    })
  })

  describe('updateCategory', () => {
    const updateData: CategoryUpdateType = { id: 1, name: 'Updated Category' }

    it('should update category successfully', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockCategory, name: updateData.name } })

      const result = await updateCategory(updateData)

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/categories/${updateData.id}`,
        { name: updateData.name }
      )
      expect(result).toEqual({ ...mockCategory, name: updateData.name })
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.patch.mockResolvedValueOnce({ data: invalidData })

      await expect(updateCategory(updateData)).rejects.toThrow(
        'error with response structure on updateCategory'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.patch.mockRejectedValueOnce(error)

      await expect(updateCategory(updateData)).rejects.toThrow('API Error')
    })
  })
}) 