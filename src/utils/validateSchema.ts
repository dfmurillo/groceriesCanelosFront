import { ZodSchema } from 'zod'

export const validateSchema = <T>(result: unknown, schema: ZodSchema): result is T => {
  const validResult = schema.safeParse(result)
  if (!validResult.success) console.error(`DFM_ error validation`, validResult.error)
  return validResult.success
}
