'use server'
 
import { revalidateTag } from 'next/cache'
 
export default async function revalidateData(tag: string) {
  revalidateTag(tag)
}