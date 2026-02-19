// Type definitions for emergency management system

export type AlertType = 'earthquake' | 'hurricane' | 'tornado' | 'flood' | 'wildfire' | 'severe-weather' | 'other'
export type AlertSeverity = 'critical' | 'warning' | 'watch' | 'advisory'
export type EventStatus = 'active' | 'monitoring' | 'resolved' | 'archived'
export type EOCStatus = 'inactive' | 'standby' | 'active' | 'deactivating'

export interface Alert {
    id: string
    type: AlertType
    severity: AlertSeverity
    title: string
    message: string
    zones: string[] // Geographic zones affected (e.g., ['A', 'B', 'C'])
    locations: string[] // City/region names
    createdAt: Date
    expiresAt?: Date
    createdBy: string // Admin user ID
    eventId?: string // Link to emergency event
    isRead?: boolean // For user tracking
}

export interface EmergencyEvent {
    id: string
    type: AlertType
    title: string
    description: string
    status: EventStatus
    severity: AlertSeverity
    location: {
        lat: number
        lng: number
        address: string
    }
    affectedZones: string[]
    magnitude?: number // For earthquakes
    category?: number // For hurricanes (1-5)
    windSpeed?: number // mph
    createdAt: Date
    updatedAt: Date
    resolvedAt?: Date
    createdBy: string
    timeline: EventTimelineItem[]
}

export interface EventTimelineItem {
    id: string
    timestamp: Date
    action: string
    description: string
    user: string
}

export interface EOCActivation {
    id: string
    status: EOCStatus
    activatedAt?: Date
    deactivatedAt?: Date
    activatedBy?: string
    reason: string
    eventId?: string
    resources: EmergencyResource[]
}

export interface EmergencyResource {
    id: string
    type: 'hospital' | 'shelter' | 'medical-clinic' | 'fema' | 'red-cross' | 'food-bank' | 'pharmacy' | 'gas' | 'lodging' | 'other'
    name: string
    location: {
        lat: number
        lng: number
        address: string
    }
    status: 'available' | 'limited' | 'full' | 'closed'
    capacity?: number
    currentOccupancy?: number
    contact?: string
    hours?: string
    distance?: number // miles from user
}

export interface UserLocation {
    id: string
    userId: string
    nickname: string
    address: string
    lat: number
    lng: number
    isPrimary: boolean
    alertPreferences: {
        earthquake: boolean
        hurricane: boolean
        tornado: boolean
        flood: boolean
        wildfire: boolean
        severeWeather: boolean
        news: boolean
        community: boolean
    }
}

export interface WeatherData {
    location: string
    current: {
        temp: number
        feelsLike: number
        condition: string
        humidity: number
        windSpeed: number
        visibility: number
        icon: string
    }
    forecast: DayForecast[]
    alerts: WeatherAlert[]
}

export interface DayForecast {
    date: Date
    high: number
    low: number
    condition: string
    precipitation: number
    icon: string
}

export interface WeatherAlert {
    id: string
    type: string
    severity: 'extreme' | 'severe' | 'moderate' | 'minor'
    headline: string
    description: string
    start: Date
    end: Date
}
