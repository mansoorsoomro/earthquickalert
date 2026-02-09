export async function getLatestEarthquakes() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
        const data = await response.json()
        return data.features || []
    } catch (error) {
        console.error('Error fetching USGS data:', error)
        return []
    }
}

export async function getWeatherData(lat: number, lon: number) {
    // Using a placeholder or public API for weather. 
    // In a real app, you'd use OpenWeatherMap with an API key.
    // For now, let's use a mock implementation that suggests where to put the key.
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

    if (!API_KEY) {
        console.warn('OpenWeatherMap API Key missing. Using mock data.')
        return {
            temp: 72,
            condition: 'Sunny',
            description: 'Clear skies'
        }
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`)
        const data = await response.json()
        return {
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description
        }
    } catch (error) {
        console.error('Error fetching weather data:', error)
        return null
    }
}
