import axios from 'axios'
import { tagSchema } from '@/schemas/Tag/Tag.schema'
import { TagCreateType, TagType, TagUpdateType } from '@/schemas/Tag/Tag.type'
import { env } from 'env.mjs'
import { createTag, deleteTag, updateTag } from '../tagActions'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock environment variables
jest.mock('env.mjs', () => ({
  env: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: 'http://test-api.com'
  }
}))

describe('Tag Actions', () => {
  const mockTag: TagType = {
    id: 1,
    name: 'Test Tag'
  }

  const mockTags: TagType[] = [mockTag]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTag', () => {
    const createData: TagCreateType = {
      name: 'New Tag',
      categoryId: 1
    }

    it('should create tag successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockTags })

      const result = await createTag(createData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/tags/`,
        {
          name: createData.name,
          category: createData.categoryId
        }
      )
      expect(result).toEqual(mockTags)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = [{ invalid: 'data' }]
      mockedAxios.post.mockResolvedValueOnce({ data: invalidData })

      await expect(createTag(createData)).rejects.toThrow(
        'Error saving tag, invalid data'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(createTag(createData)).rejects.toThrow('API Error')
    })
  })

  describe('updateTag', () => {
    const updateData: TagUpdateType = {
      id: 1,
      name: 'Updated Tag'
    }

    it('should update tag successfully', async () => {
      const updatedTag = { ...mockTag, name: updateData.name }
      mockedAxios.patch.mockResolvedValueOnce({ data: updatedTag })

      const result = await updateTag(updateData)

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/tags/${updateData.id}`,
        { name: updateData.name }
      )
      expect(result).toEqual(updatedTag)
    })

    it('should throw error when response structure is invalid', async () => {
      const invalidData = { invalid: 'data' }
      mockedAxios.patch.mockResolvedValueOnce({ data: invalidData })

      await expect(updateTag(updateData)).rejects.toThrow(
        'Error updating tag, invalid data'
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.patch.mockRejectedValueOnce(error)

      await expect(updateTag(updateData)).rejects.toThrow('API Error')
    })
  })

  describe('deleteTag', () => {
    it('should delete tag successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({})

      await deleteTag(1)

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/tags/1`
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error')
      mockedAxios.delete.mockRejectedValueOnce(error)

      await expect(deleteTag(1)).rejects.toThrow('API Error')
    })
  })
}) 