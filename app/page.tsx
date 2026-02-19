'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Activity, Users } from 'lucide-react'

export default function LandingPage() {
    const router = useRouter()

    useEffect(() => {
        // Check for existing session
        const role = localStorage.getItem('userRole')
        if (role === 'admin') {
            router.push('/admin-dashboard')
        } else if (role === 'user') {
            router.push('/user-dashboard')
        }
    }, [router])

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    {/* <Image src="/logo.png" alt="Ready2Go" width={40} height={40} /> */}
                    <span className="text-2xl font-black text-slate-900 tracking-tight">Ready<span className="text-amber-500">2</span>Go</span>
                </div>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="font-bold text-slate-600">Log In</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="font-bold bg-slate-900 text-white hover:bg-slate-800">Sign Up</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto pb-20 pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wide mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Activity className="w-4 h-4" />
                    Live Emergency Response System
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Preparedness Meets <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Real-Time Action</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    The next-generation platform for citizen safety and emergency management.
                    Connect with family, access critical resources, and stay safe when it matters most.
                </p>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Link href="/signup">
                        <Button className="h-14 px-8 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg shadow-amber-200 w-full md:w-auto">
                            Get Started Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" className="h-14 px-8 text-lg font-bold border-slate-300 text-slate-700 hover:bg-white rounded-full w-full md:w-auto">
                            Live Demo Access
                        </Button>
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Blue Sky Mode</h3>
                        <p className="text-slate-500 text-sm">Proactive monitoring and family check-ins during normal conditions.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency Alerts</h3>
                        <p className="text-slate-500 text-sm">Instant notification system for weather, earthquakes, and critical events.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Group Safety</h3>
                        <p className="text-slate-500 text-sm">Real-time status tracking for family members and teams.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
