'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/logo.png'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.name || '')
        localStorage.setItem('systemMode', data.systemMode || 'safe')
        localStorage.setItem('isSafe', String(data.user.isSafe ?? true))
        localStorage.setItem('userLocation', data.user.location || '')

        if (data.user.role === 'admin') {
          router.push('/')
        } else {
          // Regular user redirection based on safety status
          if (!data.user.isSafe) {
            router.push('/virtual-eoc')
          } else {
            router.push('/user-dashboard')
          }
        }
      } else {
        setError(data.error || 'Invalid email or password.')
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Branding (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#34385E] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 text-center max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Image
              src={logo}
              alt="Ready2Go Logo"
              width={180}
              height={100}   // approximate height, adjust if needed
              className="animate-in fade-in zoom-in duration-1000 mb-6"
            />
            {/* <h1 className="text-5xl font-black tracking-tight text-white mb-2">
              Ready<span className="text-amber-400">2</span>Go
            </h1> */}
          </div>
          <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
            The next generation of Emergency Operations. Real-time insights, group safety, and rapid response at your fingertips.
          </p>

          {/* <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-amber-400 font-bold text-lg mb-1">99.9%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Uptime Reliability</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-amber-400 font-bold text-lg mb-1">Instant</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Alert Delivery</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-slate-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo (Visible on Mobile) */}
          <div className="lg:hidden text-center mb-10 flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Ready2Go Logo"
              className="w-[100px] h-auto mb-4"
            />
            <h1 className="text-3xl font-black text-[#34385E] tracking-tight">
              Ready<span className="text-amber-400">2</span>Go
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 lg:p-10 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please sign in to your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all pr-14 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#34385E] hover:bg-[#2A2D4A] text-white font-bold py-7 rounded-2xl shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] text-lg lg:mt-4"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-[#34385E] font-bold hover:underline underline-offset-4"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
            © 2026 Ready2Go Operations
          </p>
        </div>
      </div>
    </div>
  )
}
