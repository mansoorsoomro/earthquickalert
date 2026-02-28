'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PreparednessInformationPage() {
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
    'Create an emergency go-bag for 72 hours including medicine, pet supplies, and essentials.',
    'Store important financial documents (bank accounts, insurance) in your phone\'s contact section.',
  ]

  const communityEvacuation = [
    'Identify at least 2 evacuation routes from your community.',
    'Ensure full tank of gas; local stations may run out during emergencies.',
    'Take your emergency go-bag.',
    'Know pet-friendly hotels if evacuating with pets.',
    'Secure your home and take valuables with you.',
    'Be aware of community shelters if you cannot evacuate.',
    'Take photos of your property for insurance purposes.',
    'Bookmark FEMA\'s disaster assistance for post-disaster help.',
  ]

  const shelterInPlacePrep = [
    'Identify 2 shelter locations indoors; if none available, choose the most secure room.',
    'Take shelter immediately if conditions worsen; share status via Ready2Go.',
    'Protect from severe weather hazards (tornado, high winds, hail).',
  ]

  const activeShooterPrep = [
    'Identify evacuation and shelter-in-place locations.',
    'Discuss plan with family; test Ready2Go "Are We Safe" feature.',
  ]

  const householdPets = [
    '3 days food/medicine supply',
    'Microchip identification',
    'Know pet-friendly shelters/hotels',
    'Develop contingency plans',
  ]

  const largeAnimals = [
    'Inventory and health records',
    'Unique identifiers, 1-week supplies',
    'Evacuation arrangements, escape routes',
  ]

  const preventionSteps = [
    'Secure Social Security card; provide info only when necessary.',
    'Review statements regularly.',
    'Enable mobile security features.',
    'Install firewalls and antivirus software.',
  ]

  return (
    <main className="p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen">
      {/* Header Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden p-6 md:px-8 md:py-7">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Preparedness Information</h1>
        <p className="text-slate-600 text-[15px]">Guidance for your community on emergencies and safety measures, tailored to your needs.</p>
      </div>

      <div className="bg-[#b92b27] text-white rounded-xl p-6 shadow-sm">
        <h2 className="text-[17px] font-bold mb-1">Community Emergency Preparedness Guide</h2>
        <p className="text-red-50 text-[14px]">Stay prepared with actionable guidance for various emergency scenarios. Review these protocols regularly with your family.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Individual Evacuation */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-5">Individual Evacuation</h3>
            <div className="space-y-4 mb-4">
              {individualEvacuation.map((item, idx) => (
                <label key={`ind-${idx}`} className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-start mt-[3px]">
                    <input
                      type="checkbox"
                      checked={checkedItems[`ind-${idx}`] || false}
                      onChange={() => toggleCheck(`ind-${idx}`)}
                      className="peer appearance-none w-[15px] h-[15px] min-w-[15px] border-2 border-slate-300 rounded-[3px] bg-white checked:bg-slate-700 checked:border-slate-700 transition-colors cursor-pointer"
                    />
                    <svg className="absolute inset-0 w-[15px] h-[15px] text-white pointer-events-none opacity-0 peer-checked:opacity-100 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className={`text-[13px] leading-[1.4] transition-colors ${checkedItems[`ind-${idx}`] ? 'text-slate-400' : 'text-slate-600 group-hover:text-slate-900'}`}>{item}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" className="px-6 h-8 text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold border-0">Add</Button>
              <Button className="px-6 h-8 text-[13px] bg-[#2d325a] hover:bg-[#1a1d36] text-white font-semibold flex items-center gap-1.5">Save</Button>
            </div>
            <div className="mt-8 p-4 rounded-xl bg-[#fffcf3] border border-yellow-100/60 text-[13px] text-slate-700">
              <span className="font-bold text-slate-800">For more information, refer to </span><a href="#" className="font-bold text-sky-500 hover:underline">Ready.gov</a>
            </div>
          </Card>

          {/* General Shelter-in-Place Information */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-5">General Shelter-in-Place Information</h3>
            <div className="space-y-4 mb-8">
              {shelterInPlacePrep.map((item, idx) => (
                <label key={`shelter-${idx}`} className="flex items-start gap-3 cursor-pointer group">
                  <div className={`mt-[2px] ${idx === 0 ? 'text-sky-500' : idx === 1 ? 'text-emerald-500' : 'text-sky-500'} shrink-0`}>
                    {idx === 0 && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
                    {idx === 1 && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                    {idx === 2 && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
                  </div>
                  <span className="text-[13px] leading-[1.4] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-sky-50/50 border border-sky-100 flex flex-col gap-1.5">
              <p className="font-bold text-[13px] text-[#1e3a8a]">Quick Reference:</p>
              <p className="text-[13px] text-sky-500 leading-[1.4]">Stay away from windows, seek interior rooms on lowest floor, monitor. Stay away from windows, seek interior rooms on lowest floor, monitor.</p>
            </div>
          </Card>

          {/* Emergency Planning for Pets - Household */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-1">Emergency Planning for Pets</h3>
            <p className="text-[13px] font-bold text-slate-900 mb-5">Household Pets</p>
            <div className="space-y-4 mb-4">
              {householdPets.map((item, idx) => (
                <label key={`hpet-${idx}`} className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-start mt-[3px]">
                    <input
                      type="checkbox"
                      checked={checkedItems[`hpet-${idx}`] || false}
                      onChange={() => toggleCheck(`hpet-${idx}`)}
                      className="peer appearance-none w-[15px] h-[15px] min-w-[15px] border-2 border-slate-300 rounded-[3px] bg-slate-50 checked:bg-slate-200 checked:border-slate-300 transition-colors cursor-pointer"
                    />
                    <svg className="absolute inset-0 w-[15px] h-[15px] text-slate-700 pointer-events-none opacity-0 peer-checked:opacity-100 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className={`text-[13px] leading-[1.4] transition-colors ${checkedItems[`hpet-${idx}`] ? 'text-slate-400' : 'text-slate-600 group-hover:text-slate-900'}`}>{item}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" className="px-6 h-8 text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold border-0">Add</Button>
              <Button className="px-6 h-8 text-[13px] bg-[#2d325a] hover:bg-[#1a1d36] text-white font-semibold">Save</Button>
            </div>
          </Card>

          {/* Personal Identity Theft Protection */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-4">Personal Identity Theft Protection</h3>
            <p className="text-[13px] font-bold text-slate-900 mb-4">Prevention Steps:</p>
            <div className="space-y-4 mb-8">
              {preventionSteps.map((item, idx) => (
                <label key={`prev-${idx}`} className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-[3px] text-[#8b5cf6] shrink-0">
                    {idx === 0 && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                    {idx === 1 && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                    {idx === 2 && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>}
                    {idx === 3 && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
                  </div>
                  <span className="text-[13px] leading-[1.4] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                </label>
              ))}
            </div>

            <div className="bg-[#f5f3ff] rounded-xl p-5 border border-purple-100 flex-1">
              <p className="text-[13px] font-bold text-purple-700 mb-3">Report Identity Theft:</p>
              <div className="space-y-2">
                <a href="https://IdentityTheft.gov" className="flex items-center gap-2 text-[13px] font-semibold text-[#8b5cf6] hover:underline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  IdentityTheft.gov
                </a>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#8b5cf6]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  1-877-438-4338
                </div>
              </div>
              <p className="text-[11px] font-medium text-[#8b5cf6] mt-5 leading-relaxed">
                More info: <a href="https://USA.gov" className="font-bold underline text-blue-500">USA.gov</a>
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Community or City-Wide Evacuation */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-5">Community or City-Wide Evacuation</h3>
            <div className="space-y-4 mb-4">
              {communityEvacuation.map((item, idx) => (
                <label key={`com-${idx}`} className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-start mt-[3px]">
                    <input
                      type="checkbox"
                      checked={checkedItems[`com-${idx}`] || false}
                      onChange={() => toggleCheck(`com-${idx}`)}
                      className="peer appearance-none w-[15px] h-[15px] min-w-[15px] border-2 border-slate-300 rounded-[3px] bg-slate-50 checked:bg-slate-200 checked:border-slate-300 transition-colors cursor-pointer"
                    />
                    <svg className="absolute inset-0 w-[15px] h-[15px] text-slate-700 pointer-events-none opacity-0 peer-checked:opacity-100 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className={`text-[13px] leading-[1.4] transition-colors ${checkedItems[`com-${idx}`] ? 'text-slate-400' : 'text-slate-600 group-hover:text-slate-900'}`}>{item}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" className="px-6 h-8 text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold border-0">Add</Button>
              <Button className="px-6 h-8 text-[13px] bg-[#2d325a] hover:bg-[#1a1d36] text-white font-semibold flex items-center gap-1.5">Save</Button>
            </div>
          </Card>

          {/* Active Shooter Preparedness */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-5">Active Shooter Preparedness</h3>
            <div className="space-y-4 mb-6">
              {activeShooterPrep.map((item, idx) => (
                <label key={`shooter-${idx}`} className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-[3px] text-red-500 shrink-0">
                    {idx === 0 ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    )}
                  </div>
                  <span className="text-[13px] leading-[1.4] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                </label>
              ))}
            </div>

            <div className="bg-[#fff6f6] rounded-xl p-5 border border-red-100 flex-1">
              <p className="text-[13px] font-bold text-red-700 mb-4">During Event Protocol:</p>
              <div className="grid grid-cols-3 gap-2 h-[#42px] mb-2">
                <div className="bg-[#2ecc71] rounded-lg h-10 flex items-center justify-center text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="4" r="1" /><path d="m14 8-1 4.5" /><path d="M18 10h-2l-1 4.5" /><path d="m20 16-2.5-4.5" /><path d="M14 8h-4.5" /><path d="M9 13v7" /><path d="m14 20-2.5-5.5" /></svg>
                </div>
                <div className="bg-[#f1c40f] rounded-lg h-10 flex items-center justify-center text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h2v5zm0 4h-2v-2h2v2z" /></svg>
                </div>
                <div className="bg-[#e74c3c] rounded-lg h-10 flex items-center justify-center text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2L21 8c1.5-1.5 1.5-3 0-4.5s-3-1.5-4.5 0L4.5 16.5z" /><path d="m12 12-4 4" /></svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[11px] font-bold text-center text-red-600">RUN</span>
                <span className="text-[11px] font-bold text-center text-red-600">HIDE</span>
                <span className="text-[11px] font-bold text-center text-red-600">FIGHT</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed font-semibold">
              Reference: RUN-HIDE-FIGHT training by City of Houston Public Safety
            </p>
          </Card>

          {/* Emergency Planning for Pets - Large Animals */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-1">Emergency Planning for Pets</h3>
            <p className="text-[13px] font-bold text-slate-900 mb-5">Large Animals</p>
            <div className="space-y-4 mb-4">
              {largeAnimals.map((item, idx) => (
                <label key={`lpet-${idx}`} className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-start mt-[3px]">
                    <input
                      type="checkbox"
                      checked={checkedItems[`lpet-${idx}`] || false}
                      onChange={() => toggleCheck(`lpet-${idx}`)}
                      className="peer appearance-none w-[15px] h-[15px] min-w-[15px] border-2 border-slate-300 rounded-[3px] bg-slate-50 checked:bg-slate-200 checked:border-slate-300 transition-colors cursor-pointer"
                    />
                    <svg className="absolute inset-0 w-[15px] h-[15px] text-slate-700 pointer-events-none opacity-0 peer-checked:opacity-100 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className={`text-[13px] leading-[1.4] transition-colors ${checkedItems[`lpet-${idx}`] ? 'text-slate-400' : 'text-slate-600 group-hover:text-slate-900'}`}>{item}</span>
                </label>
              ))}
            </div>
            <p className="text-[11px] font-bold text-[#1e3a8a] mt-6 mb-4">References: FEMA, Prepare4Threats.org</p>
            <div className="flex justify-end gap-3 mt-1">
              <Button variant="secondary" className="px-6 h-8 text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold border-0">Add</Button>
              <Button className="px-6 h-8 text-[13px] bg-[#2d325a] hover:bg-[#1a1d36] text-white font-semibold">Save</Button>
            </div>
          </Card>

          {/* Choking First Aid */}
          <Card className="p-6 border-slate-200 shadow-sm rounded-xl flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-900 mb-5">Choking First Aid</h3>
            <p className="text-[13px] font-bold text-slate-900 mb-3">Recognition Signs:</p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <div className="text-red-500"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 9.5h-15C3.12 9.5 2 10.62 2 12s1.12 2.5 2.5 2.5h15c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z" /></svg></div>
                Hands to throat
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <div className="text-red-500"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
                Difficulty breathing
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <div className="text-red-500"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg></div>
                Inability to talk
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <div className="text-red-500"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg></div>
                Skin/nail color changes
              </div>
            </div>

            <p className="text-[13px] font-bold text-slate-900 mb-3">Prevention:</p>
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                <div className="text-red-500 mt-[2px]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m11 11-4-4" /><path d="M11 11 7 7" /><path d="M11 11V2" /><path d="m11 11-4-4" /><path d="M7 7 2 2" /><path d="m7 7-4 4" /><path d="M20 2v6l-4 4-2-2" /></svg></div>
                Cut food small for children
              </div>
              <div className="flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                <div className="text-red-500 mt-[2px]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></div>
                Supervise young children
              </div>
              <div className="flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                <div className="text-red-500 mt-[2px]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
                Remove small objects from reach
              </div>
            </div>

            <div className="bg-[#fdf2f8] rounded-xl p-5 border border-pink-100 flex-1 mt-auto">
              <p className="text-[13px] font-bold text-pink-700 mb-2">Get Training:</p>
              <p className="flex items-center gap-2 text-[13px] font-medium text-pink-600 hover:underline cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                American Red Cross First Aid Classes (adult/pediatric)
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Additional Resources Full Width Section */}
      <Card className="p-6 md:p-8 border-slate-200 shadow-sm rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-[#1a365d]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7.54.54l3-3a5 5 0 0 1-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 1-7.54-.54l-3 3a5 5 0 0 1 7.07 7.07l1.71-1.71" /></svg></div>
          <h2 className="text-xl font-bold text-slate-900">Additional Resources</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-sky-50/70 rounded-xl p-5 border border-sky-100/60">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="text-sky-600"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg></div>
              <p className="font-bold text-[14px] text-[#1e3a8a]">Ready.gov</p>
            </div>
            <p className="text-[12px] text-sky-600 font-medium">Federal preparedness info</p>
          </div>

          <div className="bg-red-50/70 rounded-xl p-5 border border-red-100/60">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="text-red-500"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2L21 8c1.5-1.5 1.5-3 0-4.5s-3-1.5-4.5 0L4.5 16.5z" /><path d="m12 12-4 4" /></svg></div>
              <p className="font-bold text-[14px] text-red-900">FEMA</p>
            </div>
            <p className="text-[12px] text-red-600 font-medium">Disaster assistance</p>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-100/60">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="text-emerald-500"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h2v5zm0 4h-2v-2h2v2z" /></svg></div>
              <p className="font-bold text-[14px] text-emerald-900">Red Cross</p>
            </div>
            <p className="text-[12px] text-emerald-600 font-medium">First aid training</p>
          </div>

          <div className="bg-[#f5f3ff] rounded-xl p-5 border border-purple-100/60">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="text-[#8b5cf6]"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg></div>
              <p className="font-bold text-[14px] text-purple-900">IdentityTheft.gov</p>
            </div>
            <p className="text-[12px] text-[#8b5cf6] font-medium">Report identity theft</p>
          </div>
        </div>
      </Card>
    </main>
  )
}
