'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoaded) return null

  // -------------------------
  // Step 1: Send reset code
  // -------------------------
  const handleSendCode = async () => {
    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email
      })

      setStep('verify')
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  // -------------------------
  // Step 2: Verify + reset
  // -------------------------
  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      setError('Verification code and new password are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword
      })

      if (result.status === 'complete') {
        router.replace('/sign-in')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Invalid verification code')
    } finally {
      setLoading(false)
      
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-amber-800 p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">
          Reset password
        </h1>

        {error && (
          <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {step === 'request' ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="mb-4 w-full rounded border p-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />

            {/* Smart CAPTCHA */}
            <div id="clerk-captcha" className="mb-4" />

            <button
              onClick={handleSendCode}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded bg-black p-2 text-amber-600 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send reset code
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Verification code"
              className="mb-3 w-full rounded border p-2"
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="New password"
              className="mb-4 w-full rounded border p-2"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
            />

            {/* Smart CAPTCHA */}
            <div id="clerk-captcha" className="mb-4" />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded bg-green-600 p-2 text-amber-200 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Reset password
            </button>
          </>
        )}

        <p className="mt-4 text-center text-sm text-gray-200">
          Remembered your password?{' '}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
