'use client'

import React from "react"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthCard from '@/components/auth-card'
import GoogleButton from '@/components/google-button'
import { Mail, Lock } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://global-trend-taskmanagement.onrender.com'
const GOOGLE_CLIENT_ID =
  '550844686073-rej3msel5kh9e8pmtuea2t0mp97gnrbb.apps.googleusercontent.com'

declare global {
  interface Window {
    google?: any
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)

  const handleLoginSuccess = (token: string, user: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/dashboard')
  }

  const loadGoogleScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        resolve()
        return
      }

      const existingScript = document.getElementById('google-oauth-script')
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve())
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Google SDK')))
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.id = 'google-oauth-script'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google SDK'))
      document.body.appendChild(script)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      // Check if response is ok before parsing JSON
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        setError(`Server error: ${response.status} ${response.statusText}. Please ensure the backend server is running on ${API_BASE_URL}`)
        setLoading(false)
        return
      }

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid credentials')
        setLoading(false)
        return
      }

      handleLoginSuccess(data.data.token, data.data.user)
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.message?.includes('fetch')) {
        setError(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend server is running.`)
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load Google script and initialize when component mounts
    const initGoogleSignIn = async () => {
      try {
        await loadGoogleScript()

        if (window.google && window.google.accounts && window.google.accounts.id && googleButtonRef.current) {
          // Initialize Google Sign-In
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response: any) => {
              setLoading(true)
              setError('')
              
              try {
                const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ credential: response.credential }),
                })

                const data = await res.json()

                if (!res.ok || !data.success) {
                  setError(data.message || 'Google sign-in failed')
                  setLoading(false)
                  return
                }

                handleLoginSuccess(data.data.token, data.data.user)
              } catch (error: any) {
                console.error('Google auth error:', error)
                setError(error.message || 'Google sign-in failed. Please try again.')
                setLoading(false)
              }
            },
          })

          // Render Google Sign-In button
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            type: 'standard',
          })
        }
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error)
      }
    }

    initGoogleSignIn()
  }, [])

  const handleGoogleSignIn = async () => {
    // Fallback: trigger button click if Google button is rendered
    const googleButton = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement
    if (googleButton) {
      googleButton.click()
    } else {
      setError('Google Sign-In is initializing. Please wait a moment and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
      <AuthCard title="Welcome back" description="Sign in to your TaskFlow account">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-border" />
              <span className="ml-2 text-muted-foreground">Remember me</span>
            </label>
            <Link href="#" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-4">
            <div ref={googleButtonRef} className="w-full flex justify-center min-h-[40px]"></div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </AuthCard>
    </div>
  )
}
