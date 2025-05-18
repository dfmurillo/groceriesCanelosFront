import { revalidateTag } from 'next/cache'
import revalidateData from '../actions'

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}))

describe('revalidateData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls revalidateTag with the provided tag', async () => {
    const testTag = 'test-tag'
    await revalidateData(testTag)
    expect(revalidateTag).toHaveBeenCalledWith(testTag)
  })
}) 