'use client'

import { useState, useEffect } from 'react'

interface Location {
    lat: number
    lng: number
}

interface GeolocationState {
    location: Location | null
    error: string | null
    errorCode: number | null
    loading: boolean
}

const CACHED_LOCATION_KEY = 'lastKnownCoords'

function readCachedLocation(): Location | null {
    try {
        const raw = localStorage.getItem(CACHED_LOCATION_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw)
        if (
            typeof parsed?.lat === 'number' &&
            Number.isFinite(parsed.lat) &&
            typeof parsed?.lng === 'number' &&
            Number.isFinite(parsed.lng)
        ) {
            return { lat: parsed.lat, lng: parsed.lng }
        }
    } catch (err) {
        console.warn('Failed to parse cached location:', err)
    }

    return null
}

function writeCachedLocation(location: Location) {
    try {
        localStorage.setItem(CACHED_LOCATION_KEY, JSON.stringify(location))
    } catch (err) {
        console.warn('Failed to cache location:', err)
    }
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
        errorCode: null,
        loading: true,
    })

    useEffect(() => {
        if (!navigator.geolocation) {
            const cachedLocation = readCachedLocation()
            if (cachedLocation) {
                setState({
                    location: cachedLocation,
                    error: null,
                    errorCode: null,
                    loading: false,
                })
                return
            }

            setState({
                location: null,
                error: 'Geolocation is not supported by your browser',
                errorCode: null,
                loading: false,
            })
            return
        }

        let isMounted = true
        const cachedLocation = readCachedLocation()
        if (cachedLocation) {
            setState({
                location: cachedLocation,
                error: null,
                errorCode: null,
                loading: false,
            })
        }

        const handleSuccess = (position: GeolocationPosition) => {
            if (!isMounted) return

            const nextLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }
            writeCachedLocation(nextLocation)

            setState({
                location: nextLocation,
                error: null,
                errorCode: null,
                loading: false,
            })
        }

        const handleError = (error: GeolocationPositionError, isRetry = false) => {
            if (!isMounted) return

            if (!isRetry && (error.code === 2 || error.code === 3)) {
                navigator.geolocation.getCurrentPosition(
                    handleSuccess,
                    (retryError) => handleError(retryError, true),
                    {
                        enableHighAccuracy: false,
                        timeout: 20000,
                        maximumAge: 600000,
                    }
                )
                return
            }

            const fallbackLocation = readCachedLocation()
            if (fallbackLocation) {
                setState({
                    location: fallbackLocation,
                    error: null,
                    errorCode: null,
                    loading: false,
                })
                return
            }

            setState({
                location: null,
                error: error.message,
                errorCode: error.code,
                loading: false,
            })
        }

        const options = {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000,
        }

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            (error) => handleError(error),
            options
        )

        // Watch for updates
        const watchId = navigator.geolocation.watchPosition(
            handleSuccess,
            (error) => {
                if (error.code !== 1 && readCachedLocation()) return
                handleError(error)
            },
            options
        )

        return () => {
            isMounted = false
            navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    return state
}
