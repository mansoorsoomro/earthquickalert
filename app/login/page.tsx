'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, Shield, Key } from 'lucide-react'
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

        if (data.user.role === 'super-admin') {
          router.push('/super-admin-dashboard')
        } else if (data.user.role === 'admin' || data.user.role === 'sub-admin') {
          router.push('/admin-dashboard')
        } else if (data.user.role === 'eoc-manager' || data.user.role === 'eoc-observer') {
          router.push('/virtual-eoc')
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
    <div className="min-h-screen flex bg-white selection:bg-blue-600/10">
      {/* Left Side: Branding (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 text-center max-w-md">
          <div className="flex flex-col items-center mb-12">
            <Image
              src={logo}
              alt="Ready2Go Logo"
              width={200}
              height={120}
              className="animate-in fade-in zoom-in duration-1000 mb-8 drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-4xl font-black mb-6 tracking-tighter uppercase whitespace-nowrap">
            Command <span className="text-amber-400">Hub</span> Access
          </h1>
          
          <p className="text-xl text-blue-100/80 font-medium leading-relaxed mb-12">
            Secure your community. Empower your team. Access your real-time emergency intelligence terminal.
          </p>
          
          <div className="grid grid-cols-2 gap-6 text-left w-full">
            <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
               <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 mb-4 group-hover:scale-110 transition-transform">
                  <Shield size={20} />
               </div>
               <p className="text-white font-black text-lg mb-1 uppercase tracking-tight">Secure</p>
               <p className="text-[9px] text-blue-300 uppercase tracking-widest font-black opacity-60">Verified Credentials</p>
            </div>
            <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
               <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition-transform">
                  <Key size={20} />
               </div>
               <p className="text-white font-black text-lg mb-1 uppercase tracking-tight">Direct</p>
               <p className="text-[9px] text-amber-300 uppercase tracking-widest font-black opacity-60">Root Level Entry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-slate-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo (Visible on Mobile) */}
          <div className="lg:hidden text-center mb-10 flex flex-col items-center">
            <Image
              src={logo}
              alt="Ready2Go Logo"
              width={120}
              height={70}
              className="mb-4"
            />
          </div>

          <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/60 p-8 sm:p-10 lg:p-12 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Shield size={120} />
            </div>

            <div className="mb-12 text-center lg:text-left relative z-10">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter uppercase">Sign In</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Deployment Identity Verification</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Tactical Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@agency.gov"
                    className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Security Passkey
                  </label>
                  <button type="button" className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Reset Key</button>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2">
                     <Shield size={12} className="shrink-0" />
                     {error}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-3xl shadow-2xl shadow-blue-600/20 transition-all active:scale-[0.98] text-sm uppercase tracking-[0.2em] mt-4"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authorizing...</span>
                  </div>
                ) : (
                  'Authorize Entry'
                )}
              </Button>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-slate-50 relative z-10">
              <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                New command personnel?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-blue-600 font-black hover:underline underline-offset-4 decoration-2"
                >
                  Request Access
                </button>
              </p>
            </div>
          </div>

          <p className="mt-12 text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
            © 2026 Ready2Go Operations • Secure Node
          </p>
        </div>
      </div>
    </div>
  )
}
