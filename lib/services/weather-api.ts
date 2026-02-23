// Weather API Service - OpenWeatherMap Integration

import { WeatherAlert as APIWeatherAlert, AlertSeverity as APIAlertSeverity, AlertSource } from '@/lib/types/api-alerts';
import { WeatherData, DayForecast, WeatherAlert } from '@/lib/types/emergency';

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
    private baseURL = 'https://api.open-meteo.com/v1/forecast';

    /**
     * Fetch full weather data (current + forecast)
     */
    async fetchFullWeatherData(lat: number, lon: number): Promise<WeatherData> {
        try {
            const url = `${this.baseURL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
            const data = await response.json();

            const current = data.current;
            const daily = data.daily;

            const weatherData: WeatherData = {
                location: 'Current Location', // This will be updated by the caller using reverse geocode
                current: {
                    temp: Math.round(current.temperature_2m),
                    feelsLike: Math.round(current.apparent_temperature),
                    condition: this.getWeatherTitleFromCode(current.weather_code),
                    humidity: current.relative_humidity_2m,
                    windSpeed: Math.round(current.wind_speed_10m),
                    visibility: Math.round(current.visibility / 1000), // Convert meters to km or miles
                    icon: this.getWeatherIcon(current.weather_code)
                },
                forecast: daily.time.map((time: string, i: number) => ({
                    date: new Date(time),
                    high: Math.round(daily.temperature_2m_max[i]),
                    low: Math.round(daily.temperature_2m_min[i]),
                    condition: this.getWeatherTitleFromCode(daily.weather_code[i]),
                    precipitation: daily.precipitation_probability_max[i],
                    icon: this.getWeatherIcon(daily.weather_code[i])
                })),
                alerts: this.synthesizeAlerts(current.weather_code, current.temperature_2m)
            };

            return weatherData;
        } catch (error) {
            console.error('Error fetching full weather data:', error);
            throw error;
        }
    }

    /**
     * Fetch weather alerts for a location
     * @param lat - Latitude
     * @param lon - Longitude
     */
    async fetchWeatherAlerts(lat: number, lon: number): Promise<APIWeatherAlert[]> {
        try {
            // Open-Meteo current weather + basic variables
            const url = `${this.baseURL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Transform Open-Meteo current data into our WeatherAlert format
            // Since Open-Meteo doesn't provide "alerts" in the free core tier easily (requires separate API), 
            // we'll synthesize a status alert based on current conditions
            const current = data.current;
            const weatherCode = current.weather_code;
            const temp = current.temperature_2m;

            const severity = this.calculateSeverityFromCode(weatherCode, temp);
            const weatherType = this.determineWeatherTypeFromCode(weatherCode);
            const description = this.generateDescriptionFromCode(weatherCode, temp, current.wind_speed_10m);

            const alert: APIWeatherAlert = {
                id: `weather-${Date.now()}-${lat}-${lon}`,
                source: AlertSource.WEATHER_API,
                severity: severity as any,
                title: this.getWeatherTitleFromCode(weatherCode),
                description,
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
                weatherType,
                temperature: temp,
                windSpeed: current.wind_speed_10m,
                humidity: current.relative_humidity_2m,
                precipitation: current.precipitation,
                coordinates: { lat, lon },
                affectedAreas: ['Current Location'],
            };

            return [alert];
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Fallback to mock if API fails
            return this.getMockWeatherAlerts(lat, lon);
        }
    }

    /**
     * Fetch weather alerts for multiple locations
     */
    async fetchWeatherAlertsForLocations(
        locations: Array<{ lat: number; lon: number; name: string }>
    ): Promise<APIWeatherAlert[]> {
        try {
            const allAlerts: APIWeatherAlert[] = [];

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

    private getWeatherIcon(code: number): string {
        if (code === 0) return 'sun';
        if (code <= 3) return 'cloud';
        if (code <= 48) return 'cloud'; // Fog
        if (code <= 67) return 'cloud-rain';
        if (code <= 77) return 'cloud-snow';
        if (code <= 82) return 'cloud-rain';
        if (code <= 86) return 'cloud-snow';
        if (code >= 95) return 'cloud-lightning';
        return 'sun';
    }

    private synthesizeAlerts(code: number, temp: number): WeatherAlert[] {
        const alerts: WeatherAlert[] = [];
        if (code >= 95) {
            alerts.push({
                id: 'w-alert-1',
                type: 'Severe Thunderstorm',
                severity: 'severe',
                headline: 'Thunderstorm Warning',
                description: 'Severe thunderstorms detected in the area. Seek shelter.',
                start: new Date(),
                end: new Date(Date.now() + 2 * 60 * 60 * 1000)
            });
        } else if (temp > 35) {
            alerts.push({
                id: 'w-alert-heat',
                type: 'Excessive Heat',
                severity: 'moderate',
                headline: 'Heat Advisory',
                description: 'High temperatures expected. Stay hydrated.',
                start: new Date(),
                end: new Date(Date.now() + 8 * 60 * 60 * 1000)
            });
        }
        return alerts;
    }

    /**
     * WMO Weather interpretation codes (WW)
     * https://open-meteo.com/en/docs
     */
    private calculateSeverityFromCode(code: number, temp: number): APIAlertSeverity {
        if (code >= 95) return APIAlertSeverity.SEVERE; // Thunderstorms
        if (code >= 71) return APIAlertSeverity.HIGH;   // Snow
        if (code >= 51) return APIAlertSeverity.MODERATE; // Drizzle/Rain
        if (temp > 35 || temp < -10) return APIAlertSeverity.HIGH; // Extreme temps
        return APIAlertSeverity.INFO;
    }

    private determineWeatherTypeFromCode(code: number): APIWeatherAlert['weatherType'] {
        if (code >= 95) return 'thunderstorm';
        if (code >= 71) return 'snow';
        if (code >= 61) return 'rain';
        if (code >= 51) return 'rain'; // Drizzle
        if (code >= 45) return 'fog'; // Fog
        return 'other';
    }

    private getWeatherTitleFromCode(code: number): string {
        if (code === 0) return 'Sunny';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Foggy';
        if (code <= 55) return 'Drizzle';
        if (code <= 65) return 'Rainy';
        if (code <= 75) return 'Snowy';
        if (code <= 82) return 'Rain Showers';
        if (code <= 86) return 'Snow Showers';
        if (code >= 95) return 'Thunderstorm';
        return 'Fair';
    }

    private generateDescriptionFromCode(code: number, temp: number, wind: number): string {
        let desc = `Current temperature is ${temp}°C with wind speeds of ${wind} km/h. `;

        if (code >= 95) desc += 'Expect severe thunderstorms. Seek shelter if necessary.';
        else if (code >= 71) desc += 'Significant snowfall expected. Use caution on roads.';
        else if (code >= 61) desc += 'Heavy rain detected. Watch for local flooding.';
        else if (code >= 51) desc += 'Light rain/drizzle. Visibility may be reduced.';
        else if (code >= 45) desc += 'Foggy conditions. Drive safely.';
        else desc += 'Weather conditions are currently stable.';

        return desc;
    }

    /**
     * Get mock weather alerts for testing
     */
    private getMockWeatherAlerts(lat: number, lon: number): APIWeatherAlert[] {
        return [
            {
                id: `mock-weather-${Date.now()}`,
                source: AlertSource.WEATHER_API,
                severity: APIAlertSeverity.HIGH as any,
                title: 'Severe Thunderstorm Warning (Offline)',
                description: 'Service temporarily unavailable. Showing cached/mock data. Severe thunderstorms expected.',
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
