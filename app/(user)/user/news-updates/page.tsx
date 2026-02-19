'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bell, Newspaper, Volume2, VolumeX } from 'lucide-react'

export default function NewsUpdatesPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const news = [
    {
      category: 'emergency',
      title: 'Community Emergency Drill Scheduled',
      description: 'Join us for a city-wide emergency preparedness drill next Saturday to practice response procedures.',
      time: '2 hours ago',
      image: '🚨',
      type: 'push' // Audible
    },
    {
      category: 'safety',
      title: 'Planned Power Outage - Ward 4',
      description: 'Utility crews will be performing maintenance. Expect 2-hour outages starting at 10 PM.',
      time: '1 day ago',
      image: '⚡',
      type: 'feed' // Non-audible
    },
    {
      category: 'safety',
      title: 'Emergency Drill Scheduled',
      description: 'City-wide preparedness exercise is being held on Saturday to ensure readiness.',
      time: '1 day ago',
      image: '👮',
      type: 'feed'
    },
    {
      category: 'community',
      title: 'Free Health Screening Event',
      description: 'Community center wellness checkups this Thursday from 10 AM to 5 PM.',
      time: '3 days ago',
      image: '🏥',
      type: 'feed'
    },
    {
      category: 'safety',
      title: 'Traffic Alert - Highway 101',
      description: 'Highway 101 closure this weekend for planned maintenance work.',
      time: '4 days ago',
      image: '🚗',
      type: 'feed'
    },
  ]

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'safety', label: 'Safety' },
    { id: 'community', label: 'Community' },
  ]

  const filteredNews = activeCategory === 'all' ? news : news.filter(item => item.category === activeCategory)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">News & Updates</h1>
        <p className="text-gray-600">Stay informed with latest news and community updates</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${activeCategory === cat.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News Items */}
      <div className="space-y-6">
        {filteredNews.map((item, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex gap-4">
              <div className="text-4xl flex-shrink-0">{item.image}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded capitalize">
                      {item.category}
                    </span>
                    {(item as any).type === 'push' ? (
                      <span className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 italic">
                        <Volume2 className="w-3 h-3" /> PUSH ALERT (AUDIBLE)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 uppercase">
                        <VolumeX className="w-3 h-3" /> FEED ONLY
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
