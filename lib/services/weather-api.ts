// Weather API Service - OpenWeatherMap Integration

import { WeatherAlert, AlertSeverity, AlertSource } from '@/lib/types/api-alerts';

interface OpenWeatherAlert {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
}

interface OpenWeatherResponse {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current?: {
        dt: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        wind_speed: number;
        wind_deg: number;
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
    };
    alerts?: OpenWeatherAlert[];
}

export class WeatherAPIService {
    private apiKey: string;
    private baseURL = 'https://api.openweathermap.org/data/3.0/onecall';

    constructor(apiKey?: string) {
        // Use environment variable or provided key
        this.apiKey = apiKey || process.env.WEATHER_API_KEY || '';

        if (!this.apiKey) {
            console.warn('Weather API key not configured. Using mock data.');
        }
    }

    /**
     * Fetch weather alerts for a location
     * @param lat - Latitude
     * @param lon - Longitude
     */
    async fetchWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
        try {
            if (!this.apiKey) {
                // Return mock data if no API key
                return this.getMockWeatherAlerts(lat, lon);
            }

            const url = `${this.baseURL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${this.apiKey}&units=metric`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const data: OpenWeatherResponse = await response.json();

            // Transform weather alerts
            const alerts: WeatherAlert[] = [];

            if (data.alerts && data.alerts.length > 0) {
                for (const alert of data.alerts) {
                    alerts.push(this.transformToAlert(alert, data));
                }
            }

            return alerts;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    /**
     * Fetch weather alerts for multiple locations
     */
    async fetchWeatherAlertsForLocations(
        locations: Array<{ lat: number; lon: number; name: string }>
    ): Promise<WeatherAlert[]> {
        try {
            const allAlerts: WeatherAlert[] = [];

            for (const location of locations) {
                const alerts = await this.fetchWeatherAlerts(location.lat, location.lon);
                allAlerts.push(...alerts);
            }

            return allAlerts;
        } catch (error) {
            console.error('Error fetching weather for multiple locations:', error);
            throw error;
        }
    }

    /**
     * Transform OpenWeather alert to WeatherAlert
     */
    private transformToAlert(alert: OpenWeatherAlert, data: OpenWeatherResponse): WeatherAlert {
        const severity = this.calculateSeverity(alert.event, alert.tags);
        const weatherType = this.determineWeatherType(alert.event);

        return {
            id: `weather-${alert.start}-${data.lat}-${data.lon}`,
            source: AlertSource.WEATHER_API,
            severity,
            title: alert.event,
            description: alert.description,
            timestamp: new Date(alert.start * 1000).toISOString(),
            expiresAt: new Date(alert.end * 1000).toISOString(),
            weatherType,
            temperature: data.current?.temp,
            windSpeed: data.current?.wind_speed,
            humidity: data.current?.humidity,
            coordinates: {
                lat: data.lat,
                lon: data.lon,
            },
            affectedAreas: [alert.sender_name],
        };
    }

    /**
     * Calculate severity based on event type and tags
     */
    private calculateSeverity(event: string, tags: string[]): AlertSeverity {
        const eventLower = event.toLowerCase();

        // Extreme severity
        if (
            eventLower.includes('tornado') ||
            eventLower.includes('hurricane') ||
            eventLower.includes('extreme')
        ) {
            return AlertSeverity.EXTREME;
        }

        // Severe
        if (
            eventLower.includes('severe') ||
            eventLower.includes('warning') ||
            tags.includes('Extreme')
        ) {
            return AlertSeverity.SEVERE;
        }

        // High
        if (
            eventLower.includes('flood') ||
            eventLower.includes('storm') ||
            tags.includes('Severe')
        ) {
            return AlertSeverity.HIGH;
        }

        // Moderate
        if (
            eventLower.includes('watch') ||
            eventLower.includes('advisory') ||
            tags.includes('Moderate')
        ) {
            return AlertSeverity.MODERATE;
        }

        // Low
        return AlertSeverity.LOW;
    }

    /**
     * Determine weather type from event name
     */
    private determineWeatherType(event: string): WeatherAlert['weatherType'] {
        const eventLower = event.toLowerCase();

        if (eventLower.includes('tornado')) return 'tornado';
        if (eventLower.includes('hurricane') || eventLower.includes('typhoon')) return 'hurricane';
        if (eventLower.includes('flood')) return 'flood';
        if (eventLower.includes('snow') || eventLower.includes('blizzard')) return 'snow';
        if (eventLower.includes('heat')) return 'heat';
        if (eventLower.includes('cold') || eventLower.includes('freeze')) return 'cold';
        if (eventLower.includes('wind')) return 'wind';
        if (eventLower.includes('thunder') || eventLower.includes('storm')) return 'thunderstorm';

        return 'other';
    }

    /**
     * Get mock weather alerts for testing
     */
    private getMockWeatherAlerts(lat: number, lon: number): WeatherAlert[] {
        return [
            {
                id: `mock-weather-${Date.now()}`,
                source: AlertSource.WEATHER_API,
                severity: AlertSeverity.HIGH,
                title: 'Severe Thunderstorm Warning',
                description: 'Severe thunderstorms with heavy rain, strong winds, and possible hail expected in your area. Seek shelter immediately.',
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
                weatherType: 'thunderstorm',
                temperature: 28,
                windSpeed: 45,
                humidity: 85,
                precipitation: 25,
                coordinates: { lat, lon },
                affectedAreas: ['Local Area'],
            },
        ];
    }
}

// Export singleton instance
export const weatherAPI = new WeatherAPIService();
