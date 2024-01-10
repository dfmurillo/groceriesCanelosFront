import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(['true', 'false'])
      .optional()
      .transform((value) => value === 'true'),
  },
  client: {
    NEXT_PUBLIC_GROCERIES_BASE_PATH: z.string().url(),
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    NEXT_PUBLIC_GROCERIES_BASE_PATH: process.env.NEXT_PUBLIC_GROCERIES_BASE_PATH,
  },
})
