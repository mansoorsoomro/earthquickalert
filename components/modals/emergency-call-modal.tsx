'use client'

import { X, Phone, MapPin, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmergencyCallModalProps {
    isOpen: boolean
    onClose: () => void
}

export function EmergencyCallModal({ isOpen, onClose }: EmergencyCallModalProps) {
    if (!isOpen) return null

    const handleCall911 = () => {
        alert('In a real app, this would initiate a 911 call with location sharing')
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-2xl">
                <div className="bg-red-600 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Phone className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Emergency Call</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900">Important</p>
                                <p className="text-sm text-gray-700 mt-1">
                                    This will initiate a call to 911 and share your current location with emergency services.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Your Location</h3>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                            <div>
                                <p className="font-medium">San Francisco, CA 94102</p>
                                <p className="text-sm text-gray-600">Lat: 37.7749, Lng: -122.4194</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Other Emergency Contacts</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <p className="font-medium">Poison Control</p>
                                <p className="text-sm text-gray-600">1-800-222-1222</p>
                            </button>
                            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <p className="font-medium">Non-Emergency (311)</p>
                                <p className="text-sm text-gray-600">Dial 311</p>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCall911}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Call 911
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
