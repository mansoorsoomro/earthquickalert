'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, Loader2, Upload, File, FileText, Trash2, Plus } from 'lucide-react'

// Dynamic Type for the Plan definition
type EmergencyAttachment = {
  fileName: string;
  fileUrl: string;
  size: number;
  uploadedAt: string;
}

type EmergencyPlanDef = {
  id?: string;
  label: string;
  overview: string;
  steps: string[];
  attachments: EmergencyAttachment[];
}

export default function EmergencyPlanPage() {
  const [plans, setPlans] = useState<Record<string, EmergencyPlanDef>>({})
  const [selectedPlan, setSelectedPlan] = useState('hurricane_warning')
  const [aiAssistance, setAiAssistance] = useState(true)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Step editing states
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [newStepText, setNewStepText] = useState('')
  const [isSavingStep, setIsSavingStep] = useState(false)

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/admin/emergency-plans')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setPlans(data.data)
          if (!data.data[selectedPlan] && Object.keys(data.data).length > 0) {
            setSelectedPlan(Object.keys(data.data)[0])
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch emergency plans:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('planId', selectedPlan);
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/admin/emergency-plans', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        await fetchPlans()
        setSelectedFile(null)
      } else {
        alert(data.error || "Failed to upload file")
      }
    } catch (err) {
      console.error("Upload error", err)
      alert("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const currentPlan = plans[selectedPlan] || {
    label: selectedPlan.replace(/_/g, ' ').toUpperCase(),
    overview: 'Fetching operational procedures...',
    steps: [],
    attachments: []
  }

  const syncSteps = async (newSteps: string[]) => {
    setIsSavingStep(true);
    try {
      const res = await fetch('/api/admin/emergency-plans/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          steps: newSteps
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchPlans();
      } else {
        alert(data.error || "Failed to sync steps");
      }
    } catch (err) {
      console.error("Sync error", err);
    } finally {
      setIsSavingStep(false);
    }
  }

  const handleAddStep = async () => {
    if (!newStepText.trim()) return;
    const updatedSteps = [...(currentPlan.steps || []), newStepText.trim()];
    setNewStepText('');
    setIsAddingStep(false);
    await syncSteps(updatedSteps);
  }

  const handleDeleteStep = async (index: number) => {
    if (!confirm("Are you sure you want to delete this step?")) return;
    const updatedSteps = currentPlan.steps.filter((_, i) => i !== index);
    await syncSteps(updatedSteps);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="font-black text-xs uppercase tracking-[0.2em]">Synchronizing Protocol Database...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen">
      {/* Header Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden p-6 md:px-8 md:py-7">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency Plan</h1>
        <p className="text-slate-600 text-[15px]">Timely guidance and just-in-time actions for your community during emergencies.</p>
      </div>

      {/* Overview Container */}
      <Card className="p-6 md:p-8 border border-slate-200 shadow-sm rounded-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Emergency Overview</h2>
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center justify-between text-slate-700">
          <p className="font-medium text-[15px] max-w-[90%]">{currentPlan.overview}</p>
          <button className="text-slate-500 hover:text-slate-800 transition-colors p-1" aria-label="Edit overview">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Actionable Safety Steps Container */}
      <Card className="p-6 md:p-8 border border-slate-200 shadow-sm rounded-xl relative">
        {isSavingStep && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-xs font-bold uppercase">
            <Loader2 className="w-3 h-3 animate-spin" /> Syncing
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-bold text-slate-900">Actionable Safety Steps</h2>

          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value)
                setCheckedItems({})
                setSelectedFile(null)
                setIsAddingStep(false)
              }}
              className="border border-slate-200 rounded-md py-1.5 px-3 text-sm font-semibold text-slate-700 bg-white outline-none focus:border-slate-400"
            >
              {Object.entries(plans).map(([id, plan]) => (
                <option key={id} value={id}>{plan.label}</option>
              ))}
              {/* Fallback keys if DB doesn't have them yet */}
              {!plans['business_continuity'] && <option value="business_continuity">Business Continuity</option>}
              {!plans['hurricane_warning'] && <option value="hurricane_warning">Hurricane Warning</option>}
              {!plans['tornado_warning'] && <option value="tornado_warning">Tornado Warning</option>}
              {!plans['earthquake_response'] && <option value="earthquake_response">Earthquake Response</option>}
            </select>

            <select className="border border-slate-200 rounded-md py-1.5 px-3 text-sm text-slate-700 bg-white outline-none focus:border-slate-400">
              <option>Audience Selection</option>
            </select>

            <div className="flex items-center gap-3 ml-2">
              <span className="text-[13px] font-bold text-slate-900">AI Assistance</span>
              <button
                onClick={() => setAiAssistance(!aiAssistance)}
                className={`w-11 h-6 rounded-full relative transition-colors ${aiAssistance ? 'bg-slate-700' : 'bg-slate-300'}`}
                aria-label="Toggle AI Assistance"
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${aiAssistance ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {currentPlan.steps && currentPlan.steps.length > 0 ? currentPlan.steps.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/50 transition-colors group cursor-pointer border border-transparent rounded-lg">
              <label className="flex items-start gap-3 flex-1 cursor-pointer">
                <div className="relative flex items-start mt-0.5">
                  <input
                    type="checkbox"
                    checked={checkedItems[idx] || false}
                    onChange={() => toggleCheck(idx)}
                    className="peer appearance-none w-4 h-4 min-w-[1rem] border-2 border-slate-400 rounded-sm bg-white checked:bg-slate-700 checked:border-slate-700 transition-colors cursor-pointer"
                  />
                  <svg
                    className="absolute inset-0 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className={`text-[14px] leading-snug transition-colors pr-6 ${checkedItems[idx] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {step}
                </p>
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteStep(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )) : (
            <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-500 font-medium text-sm">No safety steps currently defined. Add steps to categorize them.</p>
            </div>
          )}

          {isAddingStep && (
            <div className="flex items-center gap-2 mt-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100 animate-in fade-in zoom-in duration-200">
              <Input
                autoFocus
                disabled={isSavingStep}
                placeholder="Type a new actionable safety step..."
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                className="flex-1 bg-white"
              />
              <Button onClick={handleAddStep} disabled={isSavingStep} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Save
              </Button>
              <Button variant="ghost" onClick={() => setIsAddingStep(false)} className="text-slate-500">
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 mb-8">
          {!isAddingStep && (
            <Button
              variant="secondary"
              onClick={() => setIsAddingStep(true)}
              disabled={isSavingStep}
              className="px-8 bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold border-0"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Step
            </Button>
          )}
          <Button className="px-8 bg-[#2d325a] hover:bg-[#1a1d36] text-white font-semibold">
            Send Plan
          </Button>
        </div>
      </Card>

      {/* Attachments & References Container */}
      <Card className="p-6 md:p-8 border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-bold text-slate-900">Attachments & Reference Files</h2>
        </div>

        {/* Upload Interface */}
        <div className="mb-8 p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800">Upload Reference Documents</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Securely upload PDFs, DOCs, or other collateral for {currentPlan.label} distribution and local preparedness.
          </p>

          <div className="flex items-center gap-3 w-full max-w-sm">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="text-sm border border-slate-300 px-3 py-2 rounded-md bg-white flex-1"
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-[#2d325a] hover:bg-[#1a1d36] text-white"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
            </Button>
          </div>
        </div>

        {/* Attachments List */}
        <div className="space-y-3">
          {currentPlan.attachments && currentPlan.attachments.length > 0 ? (
            currentPlan.attachments.map((attach, idx) => (
              <a
                href={attach.fileUrl}
                download
                target="_blank"
                key={idx}
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-lg transition-all group"
              >
                <div className="p-2 bg-slate-100 rounded-md text-slate-500 group-hover:text-blue-600 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-sm">{attach.fileName}</h4>
                  <p className="text-xs text-slate-500">
                    {attach.size ? (attach.size / 1024).toFixed(1) + ' KB • ' : ''}
                    Uploaded {new Date(attach.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="p-8 text-center border border-slate-100 rounded-lg bg-slate-50/50">
              <File className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-sm">No reference documents uploaded yet.</p>
            </div>
          )}
        </div>
      </Card>
    </main>
  )
}
