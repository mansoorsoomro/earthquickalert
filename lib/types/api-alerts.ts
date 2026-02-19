// TypeScript types for API-driven alerts

export enum AlertSource {
    WEATHER_API = 'weather_api',
    EARTHQUAKE_API = 'earthquake_api',
    ADMIN_MANUAL = 'admin_manual',
}

export enum AlertSeverity {
    INFO = 'info',
    LOW = 'low',
    MODERATE = 'moderate',
    HIGH = 'high',
    SEVERE = 'severe',
    EXTREME = 'extreme',
}

export interface BaseAlert {
    id: string;
    source: AlertSource;
    severity: AlertSeverity;
    title: string;
    description: string;
    timestamp: string;
    expiresAt?: string;
    affectedAreas?: string[];
    isRead?: boolean;
}

export interface WeatherAlert extends BaseAlert {
    source: AlertSource.WEATHER_API;
    weatherType: 'thunderstorm' | 'tornado' | 'hurricane' | 'flood' | 'snow' | 'heat' | 'cold' | 'wind' | 'other';
    temperature?: number;
    windSpeed?: number;
    precipitation?: number;
    humidity?: number;
    coordinates?: {
        lat: number;
        lon: number;
    };
}

export interface EarthquakeAlert extends BaseAlert {
    source: AlertSource.EARTHQUAKE_API;
    magnitude: number;
    depth: number;
    location: string;
    coordinates: {
        lat: number;
        lon: number;
    };
    tsunami?: boolean;
    felt?: number;
    significance?: number;
}

export interface AdminAlert extends BaseAlert {
    source: AlertSource.ADMIN_MANUAL;
    adminName: string;
    adminEmail: string;
    targetUsers?: string[];
    targetAreas?: string[];
    priority: 'low' | 'medium' | 'high';
}

export type Alert = WeatherAlert | EarthquakeAlert | AdminAlert;

export interface SafeZone {
    id: string;
    name: string;
    type: 'evacuation' | 'shelter' | 'safe_area' | 'restricted';
    description: string;
    coordinates: {
        lat: number;
        lon: number;
    };
    radius?: number; // in meters
    capacity?: number;
    address?: string;
    contactPhone?: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
}

export interface APIStatus {
    service: 'weather' | 'earthquake';
    status: 'connected' | 'error' | 'disconnected';
    lastUpdate: string;
    errorMessage?: string;
}

export interface AlertFilters {
    source?: AlertSource[];
    severity?: AlertSeverity[];
    dateFrom?: string;
    dateTo?: string;
    isRead?: boolean;
    affectedArea?: string;
}
