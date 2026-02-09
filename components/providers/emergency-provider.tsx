'use client'

import React from 'react'
import { AlertProvider } from '@/lib/store/alert-store'
import { EventProvider } from '@/lib/store/event-store'
// import { EOCProvider } from '@/lib/store/eoc-store'

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
    return (
        <AlertProvider>
            <EventProvider>
                {/* <EOCProvider> */}
                {children}
                {/* </EOCProvider> */}
            </EventProvider>
        </AlertProvider>
    )
}
