'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Phone, MapPin, BriefcaseMedical, Info, ShieldCheck } from 'lucide-react'

export default function EmergencyPlanPage() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', phone: '555-0101', relation: 'Parent' },
    { id: 2, name: 'John Doe', phone: '555-0102', relation: 'Neighbor' }
  ])

  const [supplies, setSupplies] = useState([
    { id: 1, item: 'Water (1 gallon per person per day)', checked: true },
    { id: 2, item: 'Non-perishable food (3-day supply)', checked: false },
    { id: 3, item: 'Flashlight and extra batteries', checked: true },
    { id: 4, item: 'First aid kit', checked: false },
    { id: 5, item: 'Whistle to signal for help', checked: false },
  ])

  const toggleSupply = (id: number) => {
    setSupplies(supplies.map(s => s.id === id ? { ...s, checked: !s.checked } : s))
  }

  return (
    <main className="flex-1 overflow-auto bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Emergency Plan</h1>
          <p className="text-slate-500">Prepare yourself and your family for any situation.</p>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="contacts" className="gap-2">
              <Phone className="w-4 h-4" /> Contacts
            </TabsTrigger>
            <TabsTrigger value="kit" className="gap-2">
              <BriefcaseMedical className="w-4 h-4" /> Supply Kit
            </TabsTrigger>
            <TabsTrigger value="meeting" className="gap-2">
              <MapPin className="w-4 h-4" /> Meeting Points
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Emergency Contacts</h2>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Contact
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {contacts.map(contact => (
                  <Card key={contact.id} className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
                    <div>
                      <h3 className="font-bold text-slate-900">{contact.name}</h3>
                      <p className="text-sm text-slate-500">{contact.relation}</p>
                      <p className="text-sm font-medium text-blue-600 mt-1">{contact.phone}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
                <Card className="p-4 flex flex-col items-center justify-center border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50 min-h-[100px] cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                    <Plus className="w-5 h-5 text-slate-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Add New Contact</span>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kit">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <h3 className="text-blue-900 font-bold mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" /> How to Build Your Kit
                </h3>
                <p className="text-blue-800/80 text-xs leading-relaxed">
                  Start with 1 gallon of water per person/day for at least 3 days. Focus on non-perishables that require no cooking. Keep your kit in a portable container near an exit.
                </p>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Basic Disaster Supplies Kit</h2>
                <span className="text-sm font-medium text-slate-500">
                  {supplies.filter(s => s.checked).length}/{supplies.length} Completed
                </span>
              </div>
              <Card className="divide-y divide-slate-100 border-slate-200 shadow-sm">
                {supplies.map(supply => (
                  <div key={supply.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id={`supply-${supply.id}`}
                      checked={supply.checked}
                      onCheckedChange={() => toggleSupply(supply.id)}
                    />
                    <Label
                      htmlFor={`supply-${supply.id}`}
                      className={`flex-1 cursor-pointer ${supply.checked ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}
                    >
                      {supply.item}
                    </Label>
                  </div>
                ))}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">App Feature Guides</h2>
              <div className="grid gap-4">
                {[
                  { title: "Are We Safe?", desc: "Use emergency check-ins to monitor household status. Statuses are visible to all group members instantly." },
                  { title: "Favorite Places", desc: "Pre-select schools, daycare, and rally points. Get one-tap directions even during stressful events." },
                  { title: "Smart 911", desc: "When calling 911 via Ready2Go, your name, current street address, and GPS coordinates are sent to dispatch." },
                  { title: "Resources Map", desc: "Find Hospitals, ATMs, and Gas Stations filtered by proximity using your device's geolocator." }
                ].map((guide, i) => (
                  <Card key={i} className="p-4 border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-1">{guide.title}</h3>
                    <p className="text-sm text-slate-500">{guide.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meeting">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Meeting Points</h2>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Location
                </Button>
              </div>
              <div className="grid gap-6">
                <Card className="p-6 border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 mb-2">Primary</Badge>
                      <h3 className="font-bold text-slate-900 text-lg">Central Park Entrance</h3>
                      <p className="text-slate-500">North Gate, near the fountain</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-2" /> View Map
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "If we cannot return home, we will meet here. Wait for 30 minutes before moving to the secondary location."
                  </p>
                </Card>

                <Card className="p-6 border-slate-200 shadow-sm opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="outline" className="text-slate-500 border-slate-200 mb-2">Secondary</Badge>
                      <h3 className="font-bold text-slate-900 text-lg">Community Center</h3>
                      <p className="text-slate-500">123 Main St</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-2" /> View Map
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
