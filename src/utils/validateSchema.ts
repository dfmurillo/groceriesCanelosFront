import { ZodSchema } from 'zod'

export const validateSchema = <T>(result: unknown, schema: ZodSchema): result is T => {
  const validResult = schema.safeParse(result)
  return validResult.success
}
