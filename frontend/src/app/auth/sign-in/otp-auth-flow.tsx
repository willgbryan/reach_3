'use client'
import { FormEvent, useState } from 'react'
import { AuthApiError } from '@supabase/supabase-js'
import { Info, MailOpenIcon } from 'lucide-react'
import { z, ZodError } from 'zod'
import { useSupabase } from '@/app/supabase-provider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthUserSchema } from '@/lib/auth-validation/validationSchema'
import { formatError } from '@/lib/error'
import { GoogleSignIn } from './google-sign-in'
import { LinkedInSignIn } from './linkedin-sign-in'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type FormData = z.infer<typeof AuthUserSchema>

function InputErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
      {children}
    </span>
  )
}

export function OTPAuthFlow() {
  const { supabase } = useSupabase()
  const [errors, setErrors] = useState<FormData>()
  const [message, setMessage] = useState<string>('')
  const [formSuccess, setFormSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  const handleSendOTP = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormSuccess(false)
    setErrors(undefined)
    setMessage('')
  
    try {
      AuthUserSchema.parse({ email })
    } catch (err) {
      if (err instanceof ZodError) {
        const errs = formatError(err) as FormData
        setErrors(errs)
        return
      }
    }
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${new URL(location.href).origin}/auth/callback?next=products`,
        shouldCreateUser: true,
        data: {
          signInMethod: 'otp'
        }
      },
    })
  
    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }
  
    setIsOtpSent(true)
    setFormSuccess(true)
    setMessage('Please check your email for a sign in code.')
  }

  const handleVerifyOTP = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormSuccess(false)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setFormSuccess(true)
    setMessage('Successfully verified. Redirecting...')
    // Here you can redirect the user or update the UI as needed
  }

  return (
    <div className="max-w-md">
      {/* <Alert variant="destructive" className="mb-10">
        <Info className="h-4 w-4 text-violet-200" />
        <AlertDescription>We are aware of an issue with email authentication and are working hard on a fix. Please use Google or LinkedIn OAuth.</AlertDescription>
      </Alert> */}
      {message && (
        <Alert variant={formSuccess ? 'default' : 'destructive'} className="mb-10">
          {formSuccess ? (
            <MailOpenIcon className="h-4 w-4 stroke-slate-900" />
          ) : (
            <Info className="h-4 w-4 text-violet-200" />
          )}
          <AlertTitle>{formSuccess ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {!isOtpSent ? (
        <>
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <Label className="text-black font-normal" htmlFor="email">[ Email ]</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#e4e4e4] text-black"
                required
              />
            </div>
            {errors?.email && <InputErrorMessage>{errors.email}</InputErrorMessage>}
            <Button variant="ghost" type="submit" className="w-full text-black hover:bg-stone-900">
             [ Sign In / Sign Up ]
            </Button>
          </form>
          <div className="mt-4 flex flex-col space-y-2">
            <GoogleSignIn />
            <LinkedInSignIn />
          </div>
        </>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="flex flex-col items-center">
            <Label htmlFor="otp" className="self-start mb-4 text-black">[ OTP ]</Label>
            <div className="flex justify-center w-full text-black">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button variant="ghost" type="submit" className="w-full mt-4 text-black hover:bg-stone-900">
            Verify OTP
          </Button>
        </form>
      )}
    </div>
  )
}