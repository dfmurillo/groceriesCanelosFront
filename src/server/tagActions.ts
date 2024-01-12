import axios from "axios";
import { tagSchema } from "@/schemas/Tag/Tag.schema";
import { TagCreateType, TagType } from "@/schemas/Tag/Tag.type";
import { env } from "env.mjs";

const isTag = (result: unknown): result is TagType[] => {
  if (!Array.isArray(result))
    return false

  let isValidTag = true
  for (const possibleTag of result) {
    const validResult = tagSchema.safeParse(possibleTag)
    if(!validResult.success) isValidTag = false
  }

  return isValidTag
}

export async function createTag({ name, categoryId: category }: TagCreateType): Promise<TagType[]> {
  try {
    const { data } = await axios.post(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/tags/`, { name, category })
    if (!isTag(data)) {
      throw new Error('Error saving tag, invalid data')
    }
    return data
  } catch (error) {
    throw new Error((error as Error).message)
  }
}


export async function deleteTag(tagId: number) {
  try {
    await axios.delete(`${env.NEXT_PUBLIC_GROCERIES_BASE_PATH}/tags/${tagId}`)
  } catch (error) {
    throw new Error((error as Error).message)
  }
}