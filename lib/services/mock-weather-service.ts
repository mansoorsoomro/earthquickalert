// Mock weather service for simulating weather API responses

import { WeatherData, WeatherAlert } from '@/lib/types/emergency'

const weatherConditions = [
    { condition: 'Partly Cloudy', icon: '⛅', temp: 72 },
    { condition: 'Sunny', icon: '☀️', temp: 78 },
    { condition: 'Rainy', icon: '🌧️', temp: 65 },
    { condition: 'Stormy', icon: '⛈️', temp: 68 },
    { condition: 'Cloudy', icon: '☁️', temp: 70 },
]

const severWeatherAlerts: WeatherAlert[] = [
    {
        id: 'alert-1',
        type: 'Severe Thunderstorm Warning',
        severity: 'severe',
        headline: 'Severe Thunderstorm Warning until 4:30 PM',
        description: 'Wind gusts up to 60 mph expected. Seek shelter immediately. Avoid outdoor activities and secure loose objects.',
        start: new Date(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    },
]

export function getMockWeatherData(location: string = 'San Francisco, CA'): WeatherData {
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

    return {
        location,
        current: {
            temp: randomCondition.temp,
            feelsLike: randomCondition.temp - 2,
            condition: randomCondition.condition,
            humidity: 65,
            windSpeed: 12,
            visibility: 10,
            icon: randomCondition.icon,
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
            high: 75 + Math.floor(Math.random() * 10),
            low: 60 + Math.floor(Math.random() * 10),
            condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)].condition,
            precipitation: Math.floor(Math.random() * 40),
            icon: weatherConditions[Math.floor(Math.random() * weatherConditions.length)].icon,
        })),
        alerts: [], // Can add severWeatherAlerts for testing
    }
}

export function getMockWeatherWithAlerts(location: string = 'San Francisco, CA'): WeatherData {
    const data = getMockWeatherData(location)
    return {
        ...data,
        alerts: severWeatherAlerts,
    }
}
