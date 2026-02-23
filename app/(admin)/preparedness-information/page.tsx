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
    'Identify 2 evacuation routes at your home and places you frequent',
    'Develop a communications plan with your family to include adding your emergency contacts to Ready2Go’s are we safe feature',
    'Identify outdoor reunification meeting place and practice reporting to your designated meeting place with your family at least 2 times a year',
    'Create an emergency go bag with enough food and supplies to last up to 72 hours. Consider medicine, pets and other unique considerations needed for your family to sustain normal living conditions without needing assistance',
    'Store important financial information such as bank accounts, insurance information in the contact section of your phone',
  ]

  const communityEvacuation = [
    'Identify at least 2 evacuation routes from your community',
    'Make sure you have a full tank of gas as local gas stations my run out of fuel',
    'Take emergency go bag with you',
    'If you have pets, know pet friendly hotels',
    'Properly secure your house and take valuables with you',
    'Know where your community’s shelters are in case you cannot evacuate',
    'Take pictures of your house for your records in case you have to report a loss to your insurance',
    'Bookmark FEMA’s disaster assistance to reference if you need assistance after a disaster',
  ]

  const shelterInPlacePrep = [
    'Identify 2 good shelter in place locations',
    'If you do not have any good options, find the most secure room in your house such as a closet or bathroom',
    'Do not wait for someone to tell you to shelter in place. If events outside become severe, immediately take shelter, and wait until officials give the all clear',
    'Share your status with your emergency contacts via the Ready2Go app.',
  ]

  const activeShooterPrep = [
    'Identify 2 evacuation routes and shelter in place (hiding) locations',
    'Discuss with your family to make sure that everyone knows what to do',
    'Test “Are We Safe” feature in Ready2Go app',
  ]

  const activeShooterAwareness = [
    'Know your surroundings',
    'Listen to your gut instinct – if it doesn’t seem right, it probably isn’t',
    'If you see something, say something – Department of Homeland Security',
  ]

  const householdPets = [
    'Have at least 3 days’ supply of food and medicine on hand',
    'Microchip your pet and ensure they have a nametag, address and phone number',
    'Know pet friendly evacuation shelters in your area',
    'Know pet friendly hotels in case of emergency evacuation',
    'Develop contingency plans for your pet to identify resources within your community to ensure that your pet is not left behind',
  ]

  const largeAnimals = [
    'Maintain an inventory of livestock to include health records',
    'Make sure all animals have a unique identifier on them at all times such as ear tags, halters, tattoos, etc.',
    'Have at least a week of food, supplies and medication readily available',
    'Make evacuation arrangements to include veterinary care',
    'If you need to leave your large animal behind, place an identifier on them such as permanent marker or collar with a phone number and ensure that the animal has escape routes (i.e. not locked in a barn)',
  ]

  const identityTheft = [
    'Secure your social security card and never carry it with you. Only provide your social security number when absolutely necessary',
    'Never provide unsolicited personal information',
    'Review financial statements carefully and promptly report unauthorized transactions',
    'Enable security features on mobile devices',
    'Install firewalls and anti-virus software on computers',
  ]

  const chokingSigns = [
    'Inability to talk',
    'Difficulty breathing or noisy breathing',
    'Squeaky sounds when trying to breathe',
    'Cough — which may be weak or forceful',
    'Skin, lips, and nails turning blue or dusky',
    'Skin flushed then turning pale or bluish in color',
    'Loss of consciousness',
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

      {/* ── General Evacuation ── */}
      <div>
        <h2 className="text-xl font-bold mb-1">General Evacuation Information</h2>
        <p className="text-sm text-gray-600 mb-4">
          Several types of emergencies could warrant an evacuation — from an impending hurricane (known emergency) where you have a few days to prepare, to an immediate spontaneous emergency such as a wildfire. Consider the following actions to prepare.
        </p>

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
                  <span className={checkedItems[`individual-${idx}`] ? 'line-through text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
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
                  <span className={checkedItems[`community-${idx}`] ? 'line-through text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
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

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 space-y-2">
          <p>
            <strong>If you can evacuate, do so.</strong> Citizens who can evacuate should — this reduces strain on first responders and speeds up recovery efforts.
          </p>
          <p>
            <strong>FEMA recommends</strong> that you prepare to be on your own without any assistance from community first responders for <strong>up to 72 hours</strong>.
          </p>
          <p>For more information on evacuation preparedness, refer to <a href="https://www.ready.gov" target="_blank" rel="noreferrer" className="underline font-semibold">Ready.gov</a>.</p>
        </div>
      </div>

      {/* ── Shelter in Place ── */}
      <div>
        <h2 className="text-xl font-bold mb-1">General Shelter-in-Place Information</h2>
        <p className="text-sm text-gray-600 mb-4">
          Shelter in place is the process of staying where you are and taking shelter rather than evacuating. Shelter-in-place locations are typically interior spaces away from windows or basements. These locations offer the best protection during severe weather events — e.g., a tornado that brings rain, hail, high winds, and flying debris.
        </p>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">To Prepare for Shelter-in-Place Emergencies</h3>
          <div className="space-y-3">
            {shelterInPlacePrep.map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems[`shelter-${idx}`] || false}
                  onChange={() => toggleCheck(`shelter-${idx}`)}
                  className="mt-1 w-4 h-4 border-gray-300 rounded"
                />
                <span className={checkedItems[`shelter-${idx}`] ? 'line-through text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Active Shooter ── */}
      <div>
        <h2 className="text-xl font-bold mb-1">Active Shooter</h2>
        <p className="text-sm text-gray-600 mb-4">Active shooter events are an unfortunate reality. Be informed and be prepared.</p>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-3">Stay Aware</h3>
            <div className="space-y-2 mb-6">
              {activeShooterAwareness.map((item, idx) => (
                <p key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 mt-0.5">•</span>{item}
                </p>
              ))}
            </div>

            <h3 className="text-lg font-bold mb-3">Prepare</h3>
            <div className="space-y-3">
              {activeShooterPrep.map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedItems[`shooter-${idx}`] || false}
                    onChange={() => toggleCheck(`shooter-${idx}`)}
                    className="mt-1 w-4 h-4 border-gray-300 rounded"
                  />
                  <span className={checkedItems[`shooter-${idx}`] ? 'line-through text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">If You Are in an Active Shooter Situation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="font-bold text-red-700 text-base">🏃 RUN</p>
                <p className="text-sm text-gray-700 mt-1">If you can get out, do. Leave belongings behind and get as far away as possible.</p>
              </div>
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <p className="font-bold text-orange-700 text-base">🫥 HIDE</p>
                <p className="text-sm text-gray-700 mt-1">If escape is not possible, find a hiding place — preferably a windowless room where you can lock or barricade the entry. Silence your cell phone.</p>
              </div>
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="font-bold text-yellow-700 text-base">✊ FIGHT</p>
                <p className="text-sm text-gray-700 mt-1">As a last resort, attempt to incapacitate the shooter by any means necessary.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
              <p>For more specific actions, take the <a href="https://www.dhs.gov/run-hide-fight" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">RUN HIDE FIGHT — Surviving an Active Shooter Event</a> training produced by the City of Houston Mayor&apos;s Office of Public Safety and Homeland Security.</p>
              <p className="mt-1 italic">⚠️ Note: Some content may not be appropriate for young children. Parental viewing is advised.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Pets ── */}
      <div>
        <h2 className="text-xl font-bold mb-1">Emergency Planning for Pets</h2>
        <p className="text-sm text-gray-600 mb-4">Regardless of the type of animal you have, many are considered part of the family. Take the following steps to keep them safe.</p>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-1">Household Pets</h3>
            <p className="text-xs text-gray-500 mb-4">Dogs, cats, birds, and other companion animals</p>
            <div className="space-y-3">
              {householdPets.map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedItems[`hpet-${idx}`] || false}
                    onChange={() => toggleCheck(`hpet-${idx}`)}
                    className="mt-1 w-4 h-4 border-gray-300 rounded"
                  />
                  <span className={checkedItems[`hpet-${idx}`] ? 'line-through text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">Add</Button>
              <Button className="flex-1 bg-gray-800 text-white">Save</Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
              Take FEMA&apos;s <a href="https://www.ready.gov/pets" target="_blank" rel="noreferrer" className="underline font-medium">Preparing Makes Sense for Pet Owners</a> course.<br />
              For more resources visit <a href="https://www.ready.gov/pets" target="_blank" rel="noreferrer" className="underline font-medium">ready.gov</a>.
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-1">Large Animal Pets</h3>
            <p className="text-xs text-gray-500 mb-4">Horses, cows, pigs, and other livestock</p>
            <div className="space-y-3">
              {largeAnimals.map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedItems[`lpet-${idx}`] || false}
                    onChange={() => toggleCheck(`lpet-${idx}`)}
                    className="mt-1 w-4 h-4 border-gray-300 rounded"
                  />
                  <span className={checkedItems[`lpet-${idx}`] ? 'line-through text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">Add</Button>
              <Button className="flex-1 bg-gray-800 text-white">Save</Button>
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded text-xs text-green-700">
              For additional resources regarding emergency planning for livestock, visit <a href="https://www.prepare4threats.org" target="_blank" rel="noreferrer" className="underline font-medium">Prepare4Threats.org</a>.
            </div>
          </Card>
        </div>
      </div>

      {/* ── Identity Theft & Choking ── */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-2">Personal Identity Theft</h3>
          <p className="text-sm text-gray-600 mb-4">
            Identity theft is when someone steals your personal information — such as your Social Security number — to commit a crime. You may not discover it until there are financial consequences like mystery charges, debt collectors, or a denied loan.
          </p>
          <p className="text-sm font-semibold text-gray-700 mb-2">Prevention Steps:</p>
          <div className="space-y-3 mb-4">
            {identityTheft.map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems[`id-${idx}`] || false}
                  onChange={() => toggleCheck(`id-${idx}`)}
                  className="mt-1 w-4 h-4 border-gray-300 rounded"
                />
                <span className={checkedItems[`id-${idx}`] ? 'line-through text-gray-400 text-sm' : 'text-gray-700 text-sm'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
          <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
            <p className="font-semibold text-purple-700 text-sm">If you are a victim of identity theft:</p>
            <p className="text-sm text-purple-700 mt-1">Report it to the <strong>Federal Trade Commission (FTC)</strong> at <a href="https://www.identitytheft.gov" target="_blank" rel="noreferrer" className="underline">IdentityTheft.gov</a> or call <strong>1-877-438-4338</strong>.</p>
            <p className="text-xs text-purple-600 mt-2">For more information, refer to <a href="https://www.usa.gov" target="_blank" rel="noreferrer" className="underline">USA.gov</a>.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-2">Choking First Aid</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choking is the <strong>fourth leading cause of unintentional injury death</strong> in adults and one of the leading causes of death in infants and children (Injury Facts 2017). The universal sign for choking is hands clutched to the throat.
          </p>
          <p className="text-sm font-semibold text-gray-700 mb-2">Warning Signs:</p>
          <div className="space-y-1 mb-4">
            {chokingSigns.map((item, idx) => (
              <p key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-0.5">•</span>{item}
              </p>
            ))}
          </div>

          <div className="p-4 bg-red-50 rounded-md border border-red-100 mb-3">
            <p className="font-semibold text-red-700 text-sm">Prevention in Children:</p>
            <ul className="mt-1 space-y-1 text-sm text-red-700">
              <li>• Cut food into small pieces</li>
              <li>• Keep small objects out of reach</li>
              <li>• Do not give hard candy to young children</li>
              <li>• Always supervise young children while eating and playing</li>
            </ul>
          </div>

          <div className="p-3 bg-pink-50 rounded-md border border-pink-100">
            <p className="font-semibold text-pink-700 text-sm">Get Trained:</p>
            <p className="text-sm text-pink-700 mt-1">
              The <a href="https://www.redcross.org/take-a-class" target="_blank" rel="noreferrer" className="underline font-medium">American Red Cross</a> offers first aid classes (adult & pediatric) online, in-classroom, or blended. Find a class near you for a nominal fee.
            </p>
          </div>
        </Card>
      </div>

      {/* ── Additional Resources ── */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Additional Resources</h3>
        <div className="grid grid-cols-4 gap-4">
          <a href="https://www.ready.gov" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
            <p className="font-semibold text-blue-700">Ready.gov</p>
            <p className="text-sm text-gray-600">Federal preparedness info &amp; evacuation guidance</p>
          </a>
          <a href="https://www.disasterassistance.gov" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
            <p className="font-semibold text-red-700">FEMA</p>
            <p className="text-sm text-gray-600">Disaster assistance &amp; 72-hour preparedness</p>
          </a>
          <a href="https://www.redcross.org/take-a-class" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-green-50 border border-green-100 hover:bg-green-100 transition-colors">
            <p className="font-semibold text-green-700">American Red Cross</p>
            <p className="text-sm text-gray-600">First aid &amp; choking training classes</p>
          </a>
          <a href="https://www.identitytheft.gov" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors">
            <p className="font-semibold text-purple-700">IdentityTheft.gov</p>
            <p className="text-sm text-gray-600">Report &amp; recover from identity theft</p>
          </a>
          <a href="https://www.dhs.gov/run-hide-fight" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors">
            <p className="font-semibold text-orange-700">Run Hide Fight Training</p>
            <p className="text-sm text-gray-600">City of Houston active shooter guidance</p>
          </a>
          <a href="https://www.ready.gov/pets" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 hover:bg-yellow-100 transition-colors">
            <p className="font-semibold text-yellow-700">FEMA — Pet Owners</p>
            <p className="text-sm text-gray-600">Preparing Makes Sense for Pet Owners</p>
          </a>
          <a href="https://www.prepare4threats.org" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-colors">
            <p className="font-semibold text-teal-700">Prepare4Threats.org</p>
            <p className="text-sm text-gray-600">Emergency planning for livestock</p>
          </a>
          <a href="https://www.usa.gov" target="_blank" rel="noreferrer" className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
            <p className="font-semibold text-slate-700">USA.gov</p>
            <p className="text-sm text-gray-600">Government services &amp; identity theft info</p>
          </a>
        </div>
      </Card>
    </main>
  )
}
