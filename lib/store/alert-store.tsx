'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Alert, AlertType, AlertSeverity } from '@/lib/types/emergency'

interface AlertStore {
    alerts: Alert[]
    createAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => Alert
    getAlertsByLocation: (locations: string[]) => Alert[]
    getAlertsByZone: (zones: string[]) => Alert[]
    markAlertAsRead: (alertId: string) => void
    deleteAlert: (alertId: string) => void
    getUnreadCount: () => number
}

const AlertContext = createContext<AlertStore | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([])

    // Load alerts from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('emergency-alerts')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // Convert date strings back to Date objects
                const alertsWithDates = parsed.map((alert: any) => ({
                    ...alert,
                    createdAt: new Date(alert.createdAt),
                    expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined,
                }))
                setAlerts(alertsWithDates)
            } catch (error) {
                console.error('Failed to load alerts:', error)
            }
        }
    }, [])

    // Save alerts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('emergency-alerts', JSON.stringify(alerts))
    }, [alerts])

    const createAlert = useCallback((alertData: Omit<Alert, 'id' | 'createdAt'>): Alert => {
        const newAlert: Alert = {
            ...alertData,
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
        }

        setAlerts(prev => [newAlert, ...prev])

        // Simulate notification
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(newAlert.title, {
                    body: newAlert.message,
                    icon: '/logo.png',
                })
            }
        }

        return newAlert
    }, [])

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
        setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    }, [])

    const getUnreadCount = useCallback((): number => {
        return alerts.filter(alert => !alert.isRead).length
    }, [alerts])

    const value: AlertStore = {
        alerts,
        createAlert,
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
