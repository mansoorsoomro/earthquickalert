import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { alertProcessor } from '@/lib/services/alert-processor'
import { AlertSource } from '@/lib/types/api-alerts'

export async function GET(req: NextRequest) {
    try {
        await connectDB()

        // Fetch all users with basic info and safety status
        const users = await User.find(
            { role: 'user' },
            'name email location isSafe lastLocationUpdate'
        ).lean()

        // Fetch global alerts (earthquakes, weather)
        const allAlerts = await alertProcessor.fetchAllAlerts()

        const relevantAlertIds = new Set<string>()

        // Filter alerts for each user based on their location
        // NOTE: In a real app, this would use geofencing. 
        // For now, we'll associate alerts that mention the user's location or are within 100 miles if coordinates were available.
        const userLocations = users.map(user => {
            const userAlerts = allAlerts.filter(alert => {
                const locationStr = user.location?.toLowerCase() || ''
                const alertTitle = alert.title.toLowerCase()
                const alertDesc = alert.description.toLowerCase()
                const alertLoc = (alert as any).location?.toLowerCase() || ''

                const isRelevant = locationStr && (
                    alertTitle.includes(locationStr) ||
                    alertDesc.includes(locationStr) ||
                    alertLoc.includes(locationStr) ||
                    locationStr.includes(alertLoc && alertLoc.length > 3 ? alertLoc : '____')
                )

                if (isRelevant) {
                    relevantAlertIds.add(alert.id)
                }

                return isRelevant
            })

            return {
                id: (user as any)._id,
                name: user.name,
                location: user.location,
                isSafe: user.isSafe,
                alerts: userAlerts
            }
        })

        // Filter globalAlerts to only include those relevant to at least one user
        const earthquakes = allAlerts.filter(a => a.source === AlertSource.EARTHQUAKE_API && relevantAlertIds.has(a.id))
        const weather = allAlerts.filter(a => a.source === AlertSource.WEATHER_API && relevantAlertIds.has(a.id))

        return NextResponse.json({
            success: true,
            data: userLocations,
            globalAlerts: {
                earthquakes,
                weather
            }
        })
    } catch (error: any) {
        console.error('Error fetching citizen locations:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
