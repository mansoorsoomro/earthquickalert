'use client'

import { useState, useEffect } from 'react'
import { X, Cloud, Wind, Eye, Droplets, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMockWeatherData } from '@/lib/services/mock-weather-service'
import { WeatherData } from '@/lib/types/emergency'

interface WeatherForecastModalProps {
    isOpen: boolean
    onClose: () => void
    location?: string
}

export function WeatherForecastModal({ isOpen, onClose, location = 'San Francisco, CA' }: WeatherForecastModalProps) {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

    useEffect(() => {
        if (isOpen) {
            setWeatherData(getMockWeatherData(location))
        }
    }, [isOpen, location])

    if (!isOpen || !weatherData) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                    <div className="flex items-center gap-2">
                        <Cloud className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold">Weather Forecast</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Current Weather */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                        <p className="text-sm opacity-90 mb-2">{weatherData.location}</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-6xl font-bold">{weatherData.current.temp}°F</div>
                                <p className="text-xl mt-2">{weatherData.current.condition}</p>
                                <p className="text-sm opacity-90">Feels like {weatherData.current.feelsLike}°F</p>
                            </div>
                            <div className="text-7xl">{weatherData.current.icon}</div>
                        </div>
                    </div>

                    {/* Current Conditions Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Wind className="w-6 h-6 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Wind Speed</p>
                                <p className="text-lg font-semibold">{weatherData.current.windSpeed} mph</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Droplets className="w-6 h-6 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Humidity</p>
                                <p className="text-lg font-semibold">{weatherData.current.humidity}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Eye className="w-6 h-6 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Visibility</p>
                                <p className="text-lg font-semibold">{weatherData.current.visibility} mi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Cloud className="w-6 h-6 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Condition</p>
                                <p className="text-lg font-semibold">{weatherData.current.condition}</p>
                            </div>
                        </div>
                    </div>

                    {/* Weather Alerts */}
                    {weatherData.alerts.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Active Alerts</h3>
                            {weatherData.alerts.map((alert) => (
                                <div key={alert.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{alert.headline}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Valid until {alert.end.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 7-Day Forecast */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">7-Day Forecast</h3>
                        <div className="space-y-2">
                            {weatherData.forecast.map((day, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl">{day.icon}</span>
                                        <div>
                                            <p className="font-semibold">
                                                {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </p>
                                            <p className="text-sm text-gray-600">{day.condition}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            <span className="text-red-600">{day.high}°</span>
                                            {' / '}
                                            <span className="text-blue-600">{day.low}°</span>
                                        </p>
                                        <p className="text-sm text-gray-600">{day.precipitation}% rain</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
