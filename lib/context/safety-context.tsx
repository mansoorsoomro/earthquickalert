'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type SafetyStatus = 'SAFE' | 'DANGER' | 'PENDING'

export interface FamilyMember {
    id: string
    name: string
    status: SafetyStatus
    lastUpdated: Date
    lat?: number
    lng?: number
}

interface SafetyContextType {
    myStatus: SafetyStatus
    setMyStatus: (status: SafetyStatus) => void
    familyMembers: FamilyMember[]
    updateFamilyMemberStatus: (id: string, status: SafetyStatus) => void
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined)

// Mock Data
const INITIAL_FAMILY: FamilyMember[] = [
    { id: '1', name: 'John (Husband)', status: 'SAFE', lastUpdated: new Date() },
    { id: '2', name: 'Sarah (Daughter)', status: 'SAFE', lastUpdated: new Date() },
    { id: '3', name: 'Grandma', status: 'PENDING', lastUpdated: new Date() },
]

export function SafetyProvider({ children }: { children: React.ReactNode }) {
    const [myStatus, setMyStatus] = useState<SafetyStatus>('SAFE')
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY)

    // In a real app, this would sync with a backend
    useEffect(() => {
        // Simulate incoming updates (optional)
    }, [])

    const updateFamilyMemberStatus = (id: string, status: SafetyStatus) => {
        setFamilyMembers(prev => prev.map(member =>
            member.id === id ? { ...member, status, lastUpdated: new Date() } : member
        ))
    }

    return (
        <SafetyContext.Provider value={{ myStatus, setMyStatus, familyMembers, updateFamilyMemberStatus }}>
            {children}
        </SafetyContext.Provider>
    )
}

export function useSafety() {
    const context = useContext(SafetyContext)
    if (context === undefined) {
        throw new Error('useSafety must be used within a SafetyProvider')
    }
    return context
}
