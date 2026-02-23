'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Alert } from '@/lib/types/emergency'

interface AlertStore {
    alerts: Alert[]
    isLoading: boolean
    error: string | null
    createAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => Promise<Alert | null>
    fetchAlerts: () => Promise<void>
    getAlertsByLocation: (locations: string[]) => Alert[]
    getAlertsByZone: (zones: string[]) => Alert[]
    markAlertAsRead: (alertId: string) => void
    deleteAlert: (alertId: string) => void
    getUnreadCount: () => number
}

const AlertContext = createContext<AlertStore | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAlerts = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/alerts/community')
            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    // Map DB alerts to the Alert type
                    const mappedAlerts: Alert[] = data.data.map((item: any) => ({
                        id: item._id || item.id,
                        type: item.type || 'other',
                        severity: item.severity,
                        title: item.title,
                        message: item.description,
                        zones: item.affectedAreas || [],
                        locations: item.locations || [],
                        createdAt: new Date(item.timestamp || item.createdAt),
                        expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
                        createdBy: item.adminName || 'Admin',
                        eventId: item.eventId,
                        isRead: item.isRead || false,
                    }))
                    setAlerts(mappedAlerts)
                }
            } else {
                setError('Failed to fetch community alerts')
            }
        } catch (err) {
            console.error('Fetch alerts error:', err)
            setError('Network error: Failed to connect to server')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAlerts()
        const interval = setInterval(fetchAlerts, 60000) // Auto refresh every minute
        return () => clearInterval(interval)
    }, [fetchAlerts])

    const createAlert = useCallback(async (alertData: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert | null> => {
        try {
            const res = await fetch('/api/alerts/community', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    severity: alertData.severity,
                    title: alertData.title,
                    description: alertData.message,
                    affectedAreas: alertData.zones,
                    expiresAt: alertData.expiresAt,
                    eventId: alertData.eventId,
                })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.success) {
                    await fetchAlerts()
                    return data.data
                }
            }
            return null
        } catch (err) {
            console.error('Create alert error:', err)
            return null
        }
    }, [fetchAlerts])

    const getAlertsByLocation = useCallback((locations: string[]): Alert[] => {
        return alerts.filter(alert =>
            alert.locations.some(loc =>
                locations.some(userLoc =>
                    loc.toLowerCase().includes(userLoc.toLowerCase()) ||
                    userLoc.toLowerCase().includes(loc.toLowerCase())
                )
            )
        )
    }, [alerts])

    const getAlertsByZone = useCallback((zones: string[]): Alert[] => {
        return alerts.filter(alert =>
            alert.zones.some(zone => zones.includes(zone))
        )
    }, [alerts])

    const markAlertAsRead = useCallback((alertId: string) => {
        setAlerts(prev =>
            prev.map(alert =>
                alert.id === alertId ? { ...alert, isRead: true } : alert
            )
        )
    }, [])

    const deleteAlert = useCallback((alertId: string) => {
        // Implement DELETE if needed in API, for now just update local state
        setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    }, [])

    const getUnreadCount = useCallback((): number => {
        return alerts.filter(alert => !alert.isRead).length
    }, [alerts])

    const value: AlertStore = {
        alerts,
        isLoading,
        error,
        createAlert,
        fetchAlerts,
        getAlertsByLocation,
        getAlertsByZone,
        markAlertAsRead,
        deleteAlert,
        getUnreadCount,
    }

    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}

export function useAlerts() {
    const context = useContext(AlertContext)
    if (context === undefined) {
        throw new Error('useAlerts must be used within an AlertProvider')
    }
    return context
}
