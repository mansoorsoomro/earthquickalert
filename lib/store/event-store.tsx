'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { EmergencyEvent, EventStatus, EventTimelineItem } from '@/lib/types/emergency'

interface EventStore {
    events: EmergencyEvent[]
    createEvent: (event: Omit<EmergencyEvent, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => EmergencyEvent
    updateEvent: (eventId: string, updates: Partial<EmergencyEvent>) => void
    addTimelineItem: (eventId: string, item: Omit<EventTimelineItem, 'id' | 'timestamp'>) => void
    getActiveEvents: () => EmergencyEvent[]
    getEventById: (eventId: string) => EmergencyEvent | undefined
    resolveEvent: (eventId: string) => void
    deleteEvent: (eventId: string) => void
}

const EventContext = createContext<EventStore | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
    const [events, setEvents] = useState<EmergencyEvent[]>([])

    // Load events from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('emergency-events')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // Convert date strings back to Date objects
                const eventsWithDates = parsed.map((event: any) => ({
                    ...event,
                    createdAt: new Date(event.createdAt),
                    updatedAt: new Date(event.updatedAt),
                    resolvedAt: event.resolvedAt ? new Date(event.resolvedAt) : undefined,
                    timeline: event.timeline.map((item: any) => ({
                        ...item,
                        timestamp: new Date(item.timestamp),
                    })),
                }))
                setEvents(eventsWithDates)
            } catch (error) {
                console.error('Failed to load events:', error)
            }
        }
    }, [])

    // Save events to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('emergency-events', JSON.stringify(events))
    }, [events])

    const createEvent = useCallback((eventData: Omit<EmergencyEvent, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): EmergencyEvent => {
        const now = new Date()
        const newEvent: EmergencyEvent = {
            ...eventData,
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now,
            updatedAt: now,
            timeline: [
                {
                    id: `timeline-${Date.now()}`,
                    timestamp: now,
                    action: 'Event Created',
                    description: `${eventData.type} event created: ${eventData.title}`,
                    user: eventData.createdBy,
                },
            ],
        }

        setEvents(prev => [newEvent, ...prev])
        return newEvent
    }, [])

    const updateEvent = useCallback((eventId: string, updates: Partial<EmergencyEvent>) => {
        setEvents(prev =>
            prev.map(event =>
                event.id === eventId
                    ? { ...event, ...updates, updatedAt: new Date() }
                    : event
            )
        )
    }, [])

    const addTimelineItem = useCallback((eventId: string, item: Omit<EventTimelineItem, 'id' | 'timestamp'>) => {
        const timelineItem: EventTimelineItem = {
            ...item,
            id: `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
        }

        setEvents(prev =>
            prev.map(event =>
                event.id === eventId
                    ? {
                        ...event,
                        timeline: [...event.timeline, timelineItem],
                        updatedAt: new Date(),
                    }
                    : event
            )
        )
    }, [])

    const getActiveEvents = useCallback((): EmergencyEvent[] => {
        return events.filter(event => event.status === 'active' || event.status === 'monitoring')
    }, [events])

    const getEventById = useCallback((eventId: string): EmergencyEvent | undefined => {
        return events.find(event => event.id === eventId)
    }, [events])

    const resolveEvent = useCallback((eventId: string) => {
        setEvents(prev =>
            prev.map(event =>
                event.id === eventId
                    ? {
                        ...event,
                        status: 'resolved' as EventStatus,
                        resolvedAt: new Date(),
                        updatedAt: new Date(),
                    }
                    : event
            )
        )
    }, [])

    const deleteEvent = useCallback((eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId))
    }, [])

    const value: EventStore = {
        events,
        createEvent,
        updateEvent,
        addTimelineItem,
        getActiveEvents,
        getEventById,
        resolveEvent,
        deleteEvent,
    }

    return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

export function useEvents() {
    const context = useContext(EventContext)
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventProvider')
    }
    return context
}
