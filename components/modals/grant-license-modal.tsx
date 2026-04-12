'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Building2, 
  Shield, 
  Loader2, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Globe, 
  Navigation,
  Search,
  Check,
  UserPlus
} from "lucide-react"
import { toast } from "sonner"
import { GoogleMap, useJsApiLoader, Autocomplete, Circle, Marker } from '@react-google-maps/api'
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_LOADER_ID } from '@/lib/constants/google-maps-config'
import { cn } from '@/lib/utils'

interface GrantLicenseModalProps {
  user: {
    _id: string;
    name: string;
    email: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '240px',
  borderRadius: '24px'
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
}

export function GrantLicenseModal({ user, isOpen, onClose, onSuccess }: GrantLicenseModalProps) {
  const [loading, setLoading] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    organizationName: '',
    billingContact: user?.name || '',
    billingAddress: '',
    billingEmail: user?.email || '',
    phoneNumber: '',
    country: user?.country || '',
    state: user?.state || '',
    city: user?.city || '',
    zipcode: user?.zipcode || '',
    radiusMile: 5,
    userId: user?._id || '',
  })

  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [autocomplete, setAutocomplete] = useState<any>(null)

  const { isLoaded } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users')
        if (res.ok) {
          const data = await res.json()
          setAvailableUsers(data.users.filter((u: any) => u.role !== 'super-admin'))
        }
      } catch (err) {
        console.error('Failed to fetch users:', err)
      }
    }
    if (isOpen) {
      fetchUsers()
      if (user) {
        setFormData(prev => ({
          ...prev,
          billingContact: user.name,
          billingEmail: user.email,
          userId: user._id,
          city: user.city || '',
          state: user.state || '',
          country: user.country || '',
          zipcode: user.zipcode || ''
        }))
        setIsNewUser(false)
      }
    }
  }, [isOpen, user])

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setMapCenter({ lat, lng })

        let city = '', state = '', country = '', zipcode = ''
        place.address_components?.forEach((c: any) => {
          if (c.types.includes('locality')) city = c.long_name
          if (c.types.includes('administrative_area_level_1')) state = c.long_name
          if (c.types.includes('country')) country = c.long_name
          if (c.types.includes('postal_code')) zipcode = c.long_name
        })

        setFormData(prev => ({
          ...prev,
          city: city || prev.city,
          state: state || prev.state,
          country: country || prev.country,
          zipcode: zipcode || prev.zipcode,
          billingAddress: place.formatted_address || prev.billingAddress
        }))
      }
    }
  }

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId && !isNewUser) {
      toast.error("Please select a user to assign as Admin")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isNewUser
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`License successfully provisioned for ${formData.organizationName}`)
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || 'Failed to provision license')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = availableUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] rounded-[40px] border-slate-200 shadow-2xl p-0 overflow-hidden bg-white text-slate-900 max-h-[95vh] overflow-y-auto outline-none border">
        <form onSubmit={handleGrant}>
          <DialogHeader className="bg-slate-50 p-10 pt-12 border-b border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center shadow-xl shadow-blue-600/20 rotate-3">
                <Shield className="text-white -rotate-3" size={32} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black tracking-tight uppercase text-slate-900 leading-tight">Provision Client License</DialogTitle>
                <DialogDescription className="text-slate-500 font-bold leading-tight mt-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                    Configure billing contact, boundaries, and administrative control.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className={cn("p-10 space-y-12 transition-all duration-300", loading && "opacity-40 pointer-events-none blur-[2px]")}>
            {/* Section 1: Billing & Contact Information */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-yellow-500">1</div> 
                  Contact information for billing
                </h3>
                <div className="px-4 py-1.5 bg-blue-600/5 rounded-full border border-blue-600/10">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Required Fields</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2.5 col-span-2 sm:col-span-1">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                      <Building2 size={12} className="text-slate-600" /> Organization Name (License Holder)
                  </Label>
                  <Input
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="e.g. State of Arkansas"
                    className="h-14 bg-slate-900 border-slate-800 rounded-2xl font-bold text-white placeholder:text-slate-700 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all text-base"
                  />
                </div>
                <div className="space-y-2.5 col-span-2 sm:col-span-1">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                      <User size={12} className="text-slate-600" /> Point of Contact
                  </Label>
                    <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <Input
                        required
                        value={formData.billingContact}
                        onChange={(e) => setFormData({ ...formData, billingContact: e.target.value })}
                        placeholder="Representative full name"
                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold text-slate-900 pl-14 placeholder:text-slate-300 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 col-span-2">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-slate-600" /> Billing Address
                  </Label>
                  {isLoaded ? (
                    <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <Input
                            required
                            value={formData.billingAddress}
                            onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                            placeholder="Search official billing address..."
                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold text-slate-900 pl-14 placeholder:text-slate-300 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-base"
                        />
                      </div>
                    </Autocomplete>
                  ) : (
                    <Input disabled className="h-14 bg-slate-900 border-slate-800 rounded-2xl text-slate-700" placeholder="Loading Address Engine..." />
                  )}
                </div>

                <div className="space-y-2.5 col-span-2 sm:col-span-1">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                      <Mail size={12} className="text-slate-600" /> Billing Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <Input
                      type="email"
                      required
                      value={formData.billingEmail}
                      onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                      placeholder="billing@org.com"
                      className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold text-slate-900 pl-14 placeholder:text-slate-300 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2.5 col-span-2 sm:col-span-1">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest flex items-center gap-2">
                      <Phone size={12} className="text-slate-600" /> Phone #
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                    <Input
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="h-14 bg-slate-900 border-slate-800 rounded-2xl font-bold text-white pl-14 placeholder:text-slate-700 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Administrative Assignment */}
            <div className="space-y-8 p-8 bg-slate-900/30 rounded-[32px] border border-slate-800/50">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-yellow-500">2</div> 
                  Assign Dedicated Sub-Admin
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsNewUser(!isNewUser)}
                  className={cn(
                    "px-4 py-2 rounded-xl border text-[11px] font-black uppercase transition-all flex items-center gap-2.5",
                    isNewUser ? "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-500/20" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 shadow-sm"
                  )}
                >
                  {isNewUser ? <Check size={14} strokeWidth={3} /> : <UserPlus size={14} />}
                  {isNewUser ? "Assigning New User" : "User not on platform?"}
                </button>
              </div>

              {isNewUser ? (
                <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-5 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shadow-sm shrink-0 text-blue-600">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-blue-600 uppercase tracking-widest mt-1">Automatic Account Provisioning</h4>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed mt-2 uppercase tracking-wide">
                      A new sub-admin account will be created for 
                      <span className="text-slate-900 ml-1.5 underline decoration-blue-500/50">{formData.billingContact || "Enter Name Above"}</span> 
                      <span className="text-slate-300 mx-2">|</span>
                      <span>{formData.billingEmail || "Enter Email Above"}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <Input
                      placeholder="Search users by name or email..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value)
                        setFormData({ ...formData, userId: '' })
                      }}
                      className="h-16 bg-slate-50 border-slate-200 rounded-2xl font-bold text-slate-900 pl-16 text-lg placeholder:text-slate-300 focus:ring-blue-600/5 focus:border-blue-600 shadow-sm"
                    />
                  </div>
                  
                  {userSearch.length > 0 && (
                    <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden max-h-[220px] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                          <div 
                            key={u._id} 
                            onClick={() => {
                              setFormData({ ...formData, userId: u._id })
                              setUserSearch(u.name)
                            }}
                            className={cn(
                              "p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-all border-b border-slate-900 last:border-0",
                              formData.userId === u._id && "bg-yellow-400/5"
                            )}
                          >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 font-black">
                                    {u.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-base font-bold text-white">{u.name}</span>
                                  <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">{u.email} • {u.role}</span>
                                </div>
                            </div>
                            {formData.userId === u._id && (
                                <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg shadow-yellow-400/20">
                                    <Check className="text-slate-950" size={14} strokeWidth={4} />
                                </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-600 text-xs font-black uppercase tracking-[0.3em]">
                          No records found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Geographic Provisioning */}
            <div className="space-y-8">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-yellow-500">3</div> 
                Geographic Area Provisioning
              </h3>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest">Country Bound</Label>
                  <Input
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. USA"
                    className="h-14 bg-slate-900 border-slate-800 rounded-2xl font-bold text-white placeholder:text-slate-700 focus:ring-yellow-400/20 text-base"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest">City / State Bound</Label>
                  <Input
                    required
                    value={formData.city || formData.state ? `${formData.city}${formData.city && formData.state ? ', ' : ''}${formData.state}` : ''}
                    onChange={(e) => {
                      const parts = e.target.value.split(',').map(v => v.trim())
                      setFormData({ 
                        ...formData, 
                        city: parts[0] || '', 
                        state: parts[1] || parts[0] || '' 
                      })
                    }}
                    placeholder="e.g. Arkansas"
                    className="h-14 bg-slate-900 border-slate-800 rounded-2xl font-bold text-white placeholder:text-slate-700 focus:ring-yellow-400/20 text-base"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black text-slate-500 uppercase ml-1 tracking-widest">Zip Code Bound</Label>
                  <Input
                    required
                    value={formData.zipcode}
                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                    placeholder="e.g. 72201"
                    className="h-14 bg-slate-900 border-slate-800 rounded-2xl font-bold text-white placeholder:text-slate-700 focus:ring-yellow-400/20 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-4">
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <Label className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                             Provisioning Radius
                        </Label>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Multiples of 5 miles</p>
                    </div>
                    <span className="text-xl font-black text-blue-600 bg-blue-600/5 px-6 py-2.5 rounded-[20px] border border-blue-600/10 shadow-sm min-w-[120px] text-center">
                      {formData.radiusMile} <span className="text-[10px] text-slate-400 ml-1 uppercase">Miles</span>
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={formData.radiusMile}
                      onChange={(e) => setFormData({ ...formData, radiusMile: parseInt(e.target.value) })}
                      className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 border border-slate-200"
                    />
                    <div className="flex justify-between text-[11px] font-black text-slate-700 uppercase tracking-widest">
                      <span>5 Mi</span>
                      <span>50 Mi</span>
                      <span>100 Mi</span>
                      <span>150 Mi</span>
                      <span>200 Mi</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <Navigation className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <p className="text-[12px] font-black uppercase text-slate-900 tracking-widest leading-none">Radius Definition</p>
                        <p className="text-[11px] text-slate-400 font-bold mt-2 uppercase tracking-wide leading-relaxed">Scaling monitoring services to {formData.radiusMile} miles around ground zero.</p>
                    </div>
                  </div>
                </div>

                {isLoaded && (
                  <div className="relative border-4 border-slate-50 rounded-[32px] overflow-hidden shadow-xl group">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={10}
                      options={{
                        disableDefaultUI: true,
                        zoomControl: false,
                        keyboardShortcuts: false,
                        styles: [
                            { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
                            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
                            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
                            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#cbd5e1' }] },
                            { featureType: 'poi', stylers: [{ visibility: 'off' }] }
                        ]
                      }}
                    >
                      <Marker position={mapCenter} />
                      <Circle
                        center={mapCenter}
                        radius={formData.radiusMile * 1609.34}
                        options={{
                          strokeColor: '#facc15',
                          strokeOpacity: 0.8,
                          strokeWeight: 3,
                          fillColor: '#facc15',
                          fillOpacity: 0.08,
                        }}
                      />
                    </GoogleMap>
                    <div className="absolute inset-0 bg-blue-600/5 pointer-events-none group-hover:bg-transparent transition-all duration-500" />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-slate-200 shadow-xl">
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em]">Monitoring Area</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-10 pt-4 bg-slate-50 flex flex-col sm:flex-row gap-5 border-t border-slate-100">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                disabled={loading}
                className="h-16 flex-1 rounded-2xl text-slate-400 font-black tracking-[0.3em] uppercase hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-[0.97]"
            >
              Discard
            </Button>
            <Button 
                type="submit" 
                disabled={loading} 
                className="h-16 flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black tracking-[0.3em] uppercase shadow-xl shadow-blue-600/20 transition-all active:scale-[0.97] gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>ASSIGNING...</span>
                </>
              ) : (
                <>
                  <Shield size={24} strokeWidth={3} /> 
                  <span>ASSIGN ADMIN</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
