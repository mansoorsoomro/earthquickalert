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
        // 2. Default behavior (for standard User Management page)
        else {
            if (session.user.role === 'sub-admin') {
                query = { role: 'user' };
            } else if (session.user.role === 'super-admin' || session.user.role === 'admin') {
                query = {}; // Super admin sees everyone by default
            }
        }

        const users = await User.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ users });
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
