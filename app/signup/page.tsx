'use client'

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/logo.png'

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSafe, setIsSafe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, isSafe }),
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
                } else if (!data.user.isSafe) {
                    router.push('/virtual-eoc')
                } else {
                    router.push('/user-dashboard')
                }
            } else {
                setError(data.error || 'Something went wrong. Please try again.')
            }
        } catch (err) {
            setError('An error occurred during signup. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Branding (Visible on Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#34385E] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-700" />

                <div className="relative z-10 text-center max-w-md">
                    <div className="flex flex-col items-center mb-8">
                        <Image
                            src={logo}
                            alt="Ready2Go Logo"
                            width={180}
                            height={100}
                            className="animate-in fade-in zoom-in duration-1000 mb-6"
                        />
                        {/* <h1 className="text-5xl font-black tracking-tight text-white mb-2">
                            Ready<span className="text-amber-400">2</span>Go
                        </h1> */}
                    </div>
                    {/* <h1 className="text-6xl font-black mb-6 tracking-tight">
                        Join Ready<span className="text-amber-400">2</span>Go
                    </h1> */}
                    <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                        Secure your community. Empower your team. Be prepared for whatever comes next with the ultimate emergency dashboard.
                    </p>

                    {/* <div className="space-y-4 text-left">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
                                ✓
                            </div>
                            <p className="text-sm font-semibold">Real-time collaboration & tracking</p>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
                                ✓
                            </div>
                            <p className="text-sm font-semibold">Instant emergency alerts & protocols</p>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-slate-50/50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo (Visible on Mobile) */}
                    <div className="lg:hidden text-center mb-10 flex flex-col items-center">
                        <Image
                            src={logo}
                            alt="Ready2Go Logo"
                            width={100}
                            height={60}
                            className="mb-4"
                        />
                        {/* <h1 className="text-3xl font-black text-[#34385E] tracking-tight">
                            Ready<span className="text-amber-400">2</span>Go
                        </h1> */}
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 lg:p-10 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Create Account</h2>
                            <p className="text-slate-500 font-medium">Start your safety journey today</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-medium"
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

                            {/* Safety Status Toggle */}
                            {/* <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="isSafe"
                                    checked={isSafe}
                                    onChange={(e) => setIsSafe(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-[#34385E] focus:ring-[#34385E]"
                                />
                                <label htmlFor="isSafe" className="text-sm font-semibold text-slate-700 cursor-pointer">
                                    I am currently safe and in a secure location
                                </label>
                            </div> */}

                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#34385E] hover:bg-[#2A2D4A] text-white font-bold py-7 rounded-2xl shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] text-lg mt-2"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    'Create Free Account'
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 font-medium">
                                Already have an account?{' '}
                                <button
                                    onClick={() => router.push('/login')}
                                    className="text-[#34385E] font-bold hover:underline underline-offset-4"
                                >
                                    Sign In
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
