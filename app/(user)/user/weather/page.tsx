'use client'

import { Card } from '@/components/ui/card'
import { Cloud, CloudRain, Sun, Wind, Eye, Droplets, AlertTriangle } from 'lucide-react'

export default function WeatherPage() {
  const forecast = [
    { day: 'Today', high: 72, low: 58, condition: 'Partly Cloudy', icon: Cloud, chance: 10 },
    { day: 'Tomorrow', high: 68, low: 55, condition: 'Rainy', icon: CloudRain, chance: 80 },
    { day: 'Wednesday', high: 65, low: 52, condition: 'Cloudy', icon: Cloud, chance: 30 },
    { day: 'Thursday', high: 75, low: 60, condition: 'Sunny', icon: Sun, chance: 5 },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weather & Alerts</h1>
        <p className="text-gray-600">Current conditions and forecast for your area</p>
      </div>

      {/* Current Weather */}
      <Card className="p-8 bg-gradient-to-br from-blue-500 to-blue-400 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">San Francisco, CA</p>
            <p className="text-6xl font-bold mb-2">72°F</p>
            <p className="text-lg mb-4">Partly Cloudy</p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5" />
                <span>12 mph</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                <span>45%</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>10 mi</span>
              </div>
            </div>
          </div>
          <Cloud className="w-32 h-32 opacity-80" />
        </div>
      </Card>

      {/* Active Warnings */}
      <Card className="p-6 bg-yellow-50 border-l-4 border-yellow-500 mb-8">
        <div className="flex gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-1">Weather Advisory</h3>
            <p className="text-yellow-800">High winds expected this evening. Secure outdoor items and use caution if driving.</p>
          </div>
        </div>
      </Card>

      {/* Forecast */}
      <div>
        <h2 className="text-2xl font-bold mb-4">4-Day Forecast</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {forecast.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold mb-3">{item.day}</h3>
                <Icon className="w-12 h-12 text-blue-500 mb-3" />
                <p className="text-sm text-gray-600 mb-3">{item.condition}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold">{item.high}°</span>
                  <span className="text-gray-500">{item.low}°</span>
                </div>
                <p className="text-xs text-gray-500">{item.chance}% rain</p>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
