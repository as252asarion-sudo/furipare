'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleSignIn() {
    const supabase = createClient()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)
    setMessage(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage(`${email} にログインリンクを送信しました。メールを確認してください。`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="bg-white border border-neutral-200 rounded-lg w-full max-w-sm p-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="font-bold text-xl text-neutral-900 tracking-tight">フリパレ</span>
        </div>

        <h1 className="text-center text-neutral-700 font-semibold text-lg mb-1">ログイン</h1>
        <p className="text-center text-neutral-500 text-sm mb-6">アカウントにサインインしてください</p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-neutral-200 rounded-md px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Googleでログイン
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-neutral-400 text-xs">または</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleMagicLink} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-medium rounded-md px-4 py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {loading ? '送信中...' : 'マジックリンクを送信'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-success-text bg-success-bg rounded-md px-3 py-2 border border-success-border">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-danger-text bg-danger-bg rounded-md px-3 py-2 border border-danger-border">{error}</p>
        )}

        <p className="mt-6 text-center text-xs text-neutral-400">
          ウラヤハカンパニー &copy; 2024
        </p>
      </div>
    </div>
  )
}
