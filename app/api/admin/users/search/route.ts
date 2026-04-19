import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

// Define a schema for users if not already defined
const CitizenSchema = new mongoose.Schema({
    name: String,
    email: String,
    postalCode: String,
    role: String,
    status: String,
})

const Citizen = mongoose.models.Citizen || mongoose.model('Citizen', CitizenSchema)

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const { searchParams } = new URL(req.url)
        const postalCode = searchParams.get('postalCode')

        if (!postalCode) {
            return NextResponse.json({ success: false, error: 'Postal code required' }, { status: 400 })
        }

        // Return mock data for Dashboard C users if DB is empty for demo purposes
        const mockUsers = [
            { id: '1', name: 'John Doe', email: 'john@example.com', postalCode: '90210', status: 'Active' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', postalCode: '90210', status: 'Active' },
            { id: '3', name: 'Bob Wilson', email: 'bob@example.com', postalCode: '10001', status: 'Active' },
            { id: '4', name: 'Alice Brown', email: 'alice@example.com', postalCode: '90210', status: 'Inactive' },
        ]

        const filteredUsers = mockUsers.filter(u => u.postalCode === postalCode)

        return NextResponse.json({ success: true, users: filteredUsers })
    } catch (error) {
        console.error('User search error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
