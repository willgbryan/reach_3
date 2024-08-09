'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthApiError } from '@supabase/supabase-js'
import { z, ZodError } from 'zod'

import { useSupabase } from '@/app/supabase-provider'
import { Alert } from '@/components/ui/alert'
import { AuthUserWithTokenSchema } from '@/lib/auth-validation/validationSchema'
import { formatError } from '@/lib/error'

type FormData = z.infer<typeof AuthUserWithTokenSchema>

function InputErrorMessage({ children }) {
  return (
    <span className="ml-1 mt-1 flex items-center text-xs font-medium tracking-wide text-red-500">
      {children}
    </span>
  )
}

export default function VerifyTokenForm() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [errors, setErrors] = useState<FormData>()
  const [message, setMessage] = useState<string>('')
  const [formSuccess, setFormSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    token: '',
  })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://themagi.systems';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // reset all states
    setFormSuccess(false)
    setErrors(undefined)
    setMessage('')

    const email = formData.email
    const token = formData.token

    try {
      AuthUserWithTokenSchema.parse({ email, token })
    } catch (err) {
      if (err instanceof ZodError) {
        const errs = formatError(err) as FormData
        setErrors(errs)
        return
      }
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        setMessage('Invalid credentials.')
        return
      }
      setMessage(error.message)
      return
    }

    // reset form
    setFormData({ email: '', token: '' })
    // router.push('/chat')
    router.push(`${baseUrl}/chat`)

  }

  return (
    <div className="w-11/12 rounded-lg p-12 px-6 py-10 sm:w-8/12 sm:px-10 sm:py-6 md:w-6/12 lg:w-5/12 2xl:w-3/12">
      {message ? (
        <Alert className={`${formSuccess ? 'alert-info' : 'alert-error'} mb-10`}>{message}</Alert>
      ) : null}
      <h2 className="mb-4 text-4xl font-semibold">Sign in</h2>
      <p className="mb-4 font-medium">Hi, Welcome back</p>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData?.email ?? ''}
            onChange={(ev) => setFormData({ ...formData, email: ev.target.value })}
            className="input input-bordered"
          />
        </div>
        {errors?.email ? <InputErrorMessage>{errors?.email}</InputErrorMessage> : null}
        <div className="form-control">
          <label htmlFor="token" className="label">
            Token
          </label>
          <input
            id="token"
            name="token"
            type="text"
            value={formData?.token ?? ''}
            onChange={(ev) => setFormData({ ...formData, token: ev.target.value })}
            className="input input-bordered"
          />
        </div>
        {errors?.token ? <InputErrorMessage>{errors?.token}</InputErrorMessage> : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Sign in</button>
        </div>
      </form>
    </div>
  )
}
