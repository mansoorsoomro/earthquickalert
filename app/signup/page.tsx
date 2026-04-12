'use client'

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/logo.png'
import { useJsApiLoader, Autocomplete, GoogleMap, MarkerF } from '@react-google-maps/api'
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_LOADER_ID } from '@/lib/constants/google-maps-config'
import { MapPin, Navigation } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSafe, setIsSafe] = useState(true)
  const [role, setRole] = useState('user')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 34.7465, lng: -92.2896 }) // Default to Little Rock, Arkansas
  const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number } | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const [autocompleteInfo, setAutocompleteInfo] = useState<any>(null)

  const { isLoaded } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  const onPlaceLoaded = (autocomplete: any) => {
    setAutocompleteInfo(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocompleteInfo) {
      const place = autocompleteInfo.getPlace()
      if (!place.geometry || !place.geometry.location) return

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      const newPos = { lat, lng }
      setMapCenter(newPos)
      setMarkerPosition(newPos)
      if (map) map.panTo(newPos)

      let newCity = ''
      let newState = ''
      let newCountry = ''
      let newZip = ''

      place.address_components?.forEach((component: any) => {
        const types = component.types
        if (types.includes('locality')) {
          newCity = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
          newState = component.long_name
        }
        if (types.includes('country')) {
          newCountry = component.long_name
        }
        if (types.includes('postal_code')) {
          newZip = component.long_name
        }
      })

      if (newCity) setCity(newCity)
      if (newState) setState(newState)
      if (newCountry) setCountry(newCountry)
      setZipcode('')
    }
  }

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newPos = { lat: latitude, lng: longitude }
          setMapCenter(newPos)
          setMarkerPosition(newPos)
          if (map) map.panTo(newPos)

          // Reverse geocode to fill fields
          if (typeof google !== 'undefined') {
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ location: newPos }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const place = results[0]
                let newCity = ''
                let newState = ''
                let newCountry = ''
                let newZip = ''

                place.address_components?.forEach((component: any) => {
                  const types = component.types
                  if (types.includes('locality')) newCity = component.long_name
                  if (types.includes('administrative_area_level_1')) newState = component.long_name
                  if (types.includes('country')) newCountry = component.long_name
                  if (types.includes('postal_code')) newZip = component.long_name
                })

                if (newCity) setCity(newCity)
                if (newState) setState(newState)
                if (newCountry) setCountry(newCountry)
                setZipcode('')
              }
            })
          }
        },
        () => {
          setError('Unable to retrieve your location. Please ensure location services are enabled.')
        }
      )
    } else {
      setError('Geolocation is not supported by your browser.')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation for Location Fields
    if (!country || !state || !city || !zipcode) {
      setError('Please provide Country, State, City, and Zipcode.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, isSafe, role, country, state, city, zipcode }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.name || '')
        localStorage.setItem('systemMode', data.systemMode || 'safe')
        localStorage.setItem('isSafe', String(data.user.isSafe ?? true))
        localStorage.setItem('userLocation', data.user.location || '')

        if (data.user.accountStatus === 'pending') {
          router.push('/pending-approval')
        } else if (data.user.role === 'super-admin' || data.user.role === 'admin' || data.user.role === 'sub-admin') {
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
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col items-center justify-center p-12 text-white relative overflow-hidden">
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-slate-50/50">
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

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 lg:p-10 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Create Account</h2>
              <p className="text-slate-500 font-medium">Start your safety journey today</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5 overflow-y-auto max-h-[70vh] px-1">
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
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
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
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-3 px-4 rounded-2xl border text-sm font-bold transition-all ${role === 'user'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                  >
                    Community Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('sub-admin')}
                    className={`py-3 px-4 rounded-2xl border text-sm font-bold transition-all ${role === 'sub-admin'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                  >
                    Sub Admin
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium ml-1">
                  {role === 'user'
                    ? "Register as a regular user to report incidents and receive safety alerts."
                    : "Register as an organization admin to manage resources and response teams."
                  }
                </p>
              </div>

              {/* Location Fields for all users */}
              <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
                {isLoaded && (
                  <div className="space-y-3 mb-2 pb-5 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <MapPin size={12} className="text-blue-600" /> Geolocation Search
                      </label>
                      <button
                        type="button"
                        onClick={handleLocateMe}
                        className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
                      >
                        <Navigation size={10} /> Detect My Location
                      </button>
                    </div>
                    <Autocomplete onLoad={onPlaceLoaded} onPlaceChanged={onPlaceChanged}>
                      <input
                        type="text"
                        placeholder="Search for your city or zip code..."
                        className="w-full px-5 py-4 bg-white border border-slate-200 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                      />
                    </Autocomplete>

                    {/* Interactive Map */}
                    <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-inner mt-4 relative group">
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={mapCenter}
                        zoom={12}
                        onLoad={(map) => setMap(map)}
                        options={{
                          disableDefaultUI: true,
                          zoomControl: true,
                          styles: [
                            {
                              "featureType": "all",
                              "elementType": "labels.text.fill",
                              "stylers": [{ "color": "#2563eb" }]
                            },
                            {
                              "featureType": "water",
                              "elementType": "geometry",
                              "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
                            }
                          ]
                        }}
                      >
                        {markerPosition && (
                          <MarkerF position={markerPosition} />
                        )}
                      </GoogleMap>
                      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-[#34385E] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/50 shadow-sm">
                        Arkansas Region
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Select Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="USA"
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34385E]/20 focus:border-[#34385E] transition-all font-bold text-slate-900 text-lg shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Select State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Arkansas"
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34385E]/20 focus:border-[#34385E] transition-all font-bold text-slate-900 text-lg shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Select City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Little Rock"
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34385E]/20 focus:border-[#34385E] transition-all font-bold text-slate-900 text-lg shadow-sm"
                      required
                    />
                    {role === 'sub-admin' && (
                      <p className="text-[9px] text-blue-600 font-bold ml-1 italic">
                        Note: Only one Sub-Admin is allowed per city.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Select Zipcode
                    </label>
                    <input
                      type="text"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      placeholder="72201"
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#34385E]/20 focus:border-[#34385E] transition-all font-bold text-slate-900 text-lg shadow-sm"
                      required
                    />
                  </div>
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
                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 rounded-2xl shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] text-lg mt-2 font-black uppercase tracking-widest"
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
                  className="text-blue-600 font-bold hover:underline underline-offset-4"
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
