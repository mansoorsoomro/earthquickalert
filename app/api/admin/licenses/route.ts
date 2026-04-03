import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import License from '@/models/License';
import User from '@/models/User';
import EOCSettings from '@/models/EOCSettings';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session || session.user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized. Only Super Admin can view licenses.' }, { status: 401 });
        }

        const licenses = await License.find({})
            .populate('assignedSubAdminId', 'name email accountStatus')
            .sort({ createdAt: -1 });

        return NextResponse.json({ licenses });
    } catch (error) {
        console.error('Fetch licenses error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session || session.user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized. Only Super Admin can create licenses.' }, { status: 401 });
        }

        const { organizationName, planType, endDate, userId, country, city } = await req.json();

        if (!organizationName || !userId) {
             return NextResponse.json({ error: 'Missing required fields (organizationName and userId)' }, { status: 400 });
        }

        // 1. Fetch the user to be assigned
        let assignedSubAdmin = await User.findById(userId);
        
        if (!assignedSubAdmin) {
             return NextResponse.json({ error: 'Selected user not found' }, { status: 404 });
        }

        // Check if there is already a sub-admin for this city (existing logic)
        if (city && country) {
            const subAdminInCity = await User.findOne({ role: 'sub-admin', city, country, _id: { $ne: assignedSubAdmin._id } });
            if (subAdminInCity) {
                return NextResponse.json({ error: `A sub-admin already exists for ${city}, ${country}` }, { status: 400 });
            }
        }
        
        // Upgrade user to sub-admin status
        assignedSubAdmin.role = 'sub-admin';
        assignedSubAdmin.accountStatus = 'approved';
        assignedSubAdmin.requestedLicense = false; // Clear request flag
        if (country) assignedSubAdmin.country = country;
        if (city) assignedSubAdmin.city = city;
        await assignedSubAdmin.save();

        // 2. Create the License
        const license = await License.create({
            organizationName,
            subscriptionDetails: {
                planType: planType || 'Enterprise',
                endDate: endDate ? new Date(endDate) : null
            },
            assignedSubAdminId: assignedSubAdmin._id
        });

        // 3. Update the sub-admin to point to this new license
        assignedSubAdmin.licenseId = license._id;
        await assignedSubAdmin.save();

        // 4. Create default EOCSettings for this license
        await EOCSettings.create({
            licenseId: license._id,
        });

        return NextResponse.json({ success: true, license });
    } catch (error: any) {
        console.error('Create license error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
