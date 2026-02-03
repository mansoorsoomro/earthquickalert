'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PreparednessParagePage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const individualEvacuation = [
    'Identify 2 evacuation routes at your home and places you frequently visit.',
    'Develop a family communications plan, including adding contacts to the Ready2Go "Are We Safe" feature.',
    'Designate an outdoor reunification meeting place and practice at least twice a year.',
    'Create an emergency go bag for 72 hours including medicine, pet supplies, and essentials.',
    'Store important financial documents (bank accounts, insurance) in your phone\'s contact section.',
  ]

  const communityEvacuation = [
    'Identify at least 2 evacuation routes from your community.',
    'Ensure full tank of gas; local stations may run out during emergencies.',
    'Take your emergency go bag.',
    'Know pet-friendly hotels if evacuating with pets.',
    'Secure your home and take valuables with you.',
    'Be aware of community shelters if you cannot evacuate.',
    'Take photos of your property for insurance purposes.',
    'Bookmark FEMA\'s disaster assistance for post-disaster help.',
  ]

  const shelterInPlace = [
    'Identify 2 shelter locations indoors; if none available, choose the most secure room.',
    'Assemble supplies: water (1 gallon/person/day), food, medications, first aid, and a battery-powered radio.',
  ]

  const activeSHooter = [
    'Identify evacuation and shelter-in-place locations.',
    'Discuss plan with family; test Ready2Go "Are We Safe" feature.',
  ]

  return (
    <main className="p-6 space-y-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
        <h1 className="text-3xl font-bold mb-2">Preparedness Information</h1>
        <p className="text-gray-600">Guidance for your community on emergencies and safety measures, tailored to your needs.</p>
      </div>

      <Card className="p-6 bg-red-600 text-white rounded-lg">
        <h2 className="text-xl font-bold mb-2">Community Emergency Preparedness Guide</h2>
        <p className="text-red-100">Stay prepared with actionable guidance for various emergency scenarios. Review these protocols regularly with your family.</p>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Individual Evacuation</h3>
          <div className="space-y-3">
            {individualEvacuation.map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems[`individual-${idx}`] || false}
                  onChange={() => toggleCheck(`individual-${idx}`)}
                  className="mt-1 w-4 h-4 border-gray-300 rounded"
                />
                <span className={checkedItems[`individual-${idx}`] ? 'line-through text-gray-500' : 'text-gray-700 text-sm'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <Button variant="outline" className="w-full bg-transparent">Add</Button>
            <Button className="w-full bg-gray-800 text-white hover:bg-gray-900">Save</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Community or City-Wide Evacuation</h3>
          <div className="space-y-3">
            {communityEvacuation.map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems[`community-${idx}`] || false}
                  onChange={() => toggleCheck(`community-${idx}`)}
                  className="mt-1 w-4 h-4 border-gray-300 rounded"
                />
                <span className={checkedItems[`community-${idx}`] ? 'line-through text-gray-500' : 'text-gray-700 text-sm'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <Button variant="outline" className="w-full bg-transparent">Add</Button>
            <Button className="w-full bg-gray-800 text-white hover:bg-gray-900">Save</Button>
          </div>
        </Card>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <p className="text-yellow-800">For more information, refer to <a href="#" className="text-blue-500 underline">Ready.gov</a></p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">General Shelter-in-Place Information</h3>
          <div className="space-y-3">
            {shelterInPlace.map((item, idx) => (
              <p key={idx} className="text-sm text-gray-700">
                <span className="font-semibold">•</span> {item}
              </p>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Active Shooter Preparedness</h3>
          <div className="space-y-3">
            {activeSHooter.map((item, idx) => (
              <p key={idx} className="text-sm text-gray-700">
                <span className="font-semibold">•</span> {item}
              </p>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Emergency Planning for Pets</h3>
          <p className="text-sm text-gray-700 font-semibold mb-3">Household Pets</p>
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-gray-700">3 days food/medicine supply</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-gray-700">Microchip identification</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-gray-700">Know pet-friendly shelters/hotels</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-gray-700">Develop contingency plans</span>
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent">Add</Button>
            <Button className="flex-1 bg-gray-800 text-white">Save</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Emergency Planning for Pets</h3>
          <p className="text-sm text-gray-700 font-semibold mb-3">Large Animals</p>
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-gray-700">Inventory and health records</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-gray-700">Unique identifiers, 1-week supplies</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 w-4 h-4" />
              <span className="text-sm text-gray-700">Evacuation arrangements, escape routes</span>
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent">Add</Button>
            <Button className="flex-1 bg-gray-800 text-white">Save</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Personal Identity Theft Protection</h3>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p>Prevention Steps:</p>
            <ul className="list-none space-y-2">
              <li>Secure Social Security card, provide info only when necessary</li>
              <li>Review statements regularly</li>
              <li>Enable mobile security features</li>
              <li>Install firewalls and antivirus software</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
            <p className="font-semibold text-purple-700">Report Identity Theft:</p>
            <p className="text-sm text-purple-700">IdentityTheft.gov</p>
            <p className="text-sm text-purple-700">1-877-438-4338</p>
            <p className="text-sm text-purple-700 mt-2">More info: USA.gov</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Choking First Aid</h3>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p className="font-semibold">Recognition Signs:</p>
            <ul className="list-none space-y-2">
              <li>Hands to throat</li>
              <li>Inability to talk</li>
              <li>Difficulty breathing</li>
              <li>Skin/nail color changes</li>
            </ul>
          </div>

          <div className="p-4 bg-red-50 rounded-md border border-red-100">
            <p className="font-semibold text-red-700">Prevention:</p>
            <ul className="list-none text-sm text-red-700 space-y-2">
              <li>Cut food small for children</li>
              <li>Supervise young children</li>
              <li>Remove small objects from reach</li>
            </ul>
            <div className="mt-3 p-3 bg-pink-50 rounded-md border border-pink-100">
              <p className="font-semibold text-pink-700">Get Training:</p>
              <p className="text-sm text-pink-700">American Red Cross First Aid Classes (adult/pediatric)</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Additional Resources</h3>
        <div className="grid grid-cols-4 gap-4">
          <a href="#" className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="font-semibold text-blue-700">Ready.gov</p>
            <p className="text-sm text-gray-600">Federal preparedness info</p>
          </a>
          <a href="#" className="p-4 rounded-lg bg-red-50 border border-red-100">
            <p className="font-semibold text-red-700">FEMA</p>
            <p className="text-sm text-gray-600">Disaster assistance</p>
          </a>
          <a href="#" className="p-4 rounded-lg bg-green-50 border border-green-100">
            <p className="font-semibold text-green-700">Red Cross</p>
            <p className="text-sm text-gray-600">First aid training</p>
          </a>
          <a href="#" className="p-4 rounded-lg bg-purple-50 border border-purple-100">
            <p className="font-semibold text-purple-700">IdentityTheft.gov</p>
            <p className="text-sm text-gray-600">Report identity theft</p>
          </a>
        </div>
      </Card>
    </main>
  )
}
