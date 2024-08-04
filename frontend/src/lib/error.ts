import type { ZodError } from 'zod'

export const formatError = (zodError: ZodError) => {
  const formattedErrors: Record<string, string> = {}
  zodError.errors.forEach((err) => {
    const k = err.path.pop() as string
    if (formattedErrors[k] == null) {
      formattedErrors[k] = err.message
    }
  })
  return formattedErrors
}
