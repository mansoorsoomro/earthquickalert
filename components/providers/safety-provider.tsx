'use client'

import { SafetyProvider as ContextProvider } from '@/lib/context/safety-context'

export function SafetyProvider({ children }: { children: React.ReactNode }) {
    return <ContextProvider>{children}</ContextProvider>
}
