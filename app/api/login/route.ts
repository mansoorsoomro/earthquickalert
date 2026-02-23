import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import SystemStatus from '@/models/SystemStatus';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        let body;
        try {
            body = await req.json();
        } catch (e) {
            console.error('Failed to parse request body:', e);
            return NextResponse.json({ error: 'Invalid JSON message' }, { status: 400 });
        }

        const { email, password } = body;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Fetch current system mode
        let systemStatus = await SystemStatus.findOne();
        if (!systemStatus) {
            systemStatus = await SystemStatus.create({ emergencyMode: 'safe' });
        }

        // Create session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const session = await encrypt({
            user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
            expires
        });

        const response = NextResponse.json({
            success: true,
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                isSafe: user.isSafe ?? true,
                location: user.location || ''
            },
            systemMode: systemStatus.emergencyMode
        });

        (await cookies()).set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        (await cookies()).set('userRole', user.role, {
            expires,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login error detailed:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
