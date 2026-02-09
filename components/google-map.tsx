'use client'

import React from 'react'

export function GoogleMap({ address = "San Francisco, CA" }: { address?: string }) {
    // Using Google Maps Embed API (Standard iframe)
    // This is a simple, keyless way to show a map, but for a production app,
    // the user would replace this with an API-key driven implementation.
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(address)}`

    // However, since I don't have a key, I'll use a generic URL that works for demo purposes
    // or a placeholder if the key is missing.
    const fallbackUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`

    return (
        <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-inner border border-slate-200">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={fallbackUrl}
            ></iframe>
            <div className="bg-slate-50 p-2 text-[10px] text-slate-400 text-center italic border-t border-slate-200">
                Google Maps Integration Active • [Replace YOUR_API_KEY in google-map.tsx for full features]
            </div>
        </div>
    )
}
