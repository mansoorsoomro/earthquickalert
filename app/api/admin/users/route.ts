import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();
        const { searchParams } = new URL(req.url);
        const roleFilter = searchParams.get('role');
        const requestedLicenseFilter = searchParams.get('requestedLicense');

        if (!session || (session.user.role !== 'super-admin' && session.user.role !== 'sub-admin' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let query: any = {};
        
        // 1. If explicit role filter is provided (e.g., from Super Admin pages)
        if (roleFilter) {
            query.role = roleFilter;
            
            // Security: Sub-admins can't filter for roles they are not allowed to manage
            if (session.user.role === 'sub-admin' && roleFilter !== 'user') {
                return NextResponse.json({ error: 'Unauthorized role access' }, { status: 403 });
            }
        } 
        // 2. If filtering for license requests
        else if (requestedLicenseFilter === 'true') {
            query.requestedLicense = true;
        }
        // 3. Default behavior (for standard User Management page)
        else {
            if (session.user.role === 'sub-admin') {
                // If sub-admin, only show users created by THEM
                query = { createdBy: session.user.id };
            } else if (session.user.role === 'super-admin' || session.user.role === 'admin') {
                query = {}; // Super admin sees everyone by default
            }
        }

        const users = await User.find(query).sort({ createdAt: -1 });

        // Include current user license status for sub-admins
        let currentUser: any = null;
        if (session.user.role !== 'super-admin') {
            const user = await User.findById(session.user.id);
            if (user) {
                currentUser = {
                    hasLicense: !!user.licenseId,
                    requestedLicense: !!user.requestedLicense
                };
            }
        }

        return NextResponse.json({ users, currentUser });
    } catch (error) {
        console.error('Fetch users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session || (session.user.role !== 'super-admin' && session.user.role !== 'sub-admin' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, accountStatus, role } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Find the user first to check their role if the requester is a sub-admin
        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Sub-admin restriction: can only modify regular users
        if (session.user.role === 'sub-admin' && targetUser.role !== 'user') {
            return NextResponse.json({ error: 'Sub-Admins can only manage regular users' }, { status: 403 });
        }

        const updateData: any = {};
        if (accountStatus) updateData.accountStatus = accountStatus;
        if (role) {
            // Sub-admins cannot promote users to sub-admin or super-admin
            if (session.user.role === 'sub-admin' && (role === 'sub-admin' || role === 'super-admin' || role === 'admin')) {
                return NextResponse.json({ error: 'Unauthorized role promotion' }, { status: 403 });
            }
            updateData.role = role;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session || (session.user.role !== 'super-admin' && session.user.role !== 'sub-admin' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Fetch current user and check license count
        const creator = await User.findById(session.user.id);
        if (!creator) {
            return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
        }

        // Only enforce limit for sub-admins
        if (session.user.role === 'sub-admin' && creator.licenseId) {
            const userCount = await User.countDocuments({ licenseId: creator.licenseId });
            // Total limit (including sub-admin) should be 21 (sub-admin + 20 EOC users)
            if (userCount >= 21) {
                return NextResponse.json({ error: 'Organization user limit (20) has been reached.' }, { status: 403 });
            }
        }

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            licenseId: creator.licenseId || null,
            city: creator.city || '',
            country: creator.country || '',
            accountStatus: 'approved',
            createdBy: session.user.id
        });

        return NextResponse.json({ 
            success: true, 
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error: any) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
