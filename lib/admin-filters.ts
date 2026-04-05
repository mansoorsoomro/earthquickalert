import User from '@/models/User';
import mongoose from 'mongoose';

export async function getSubAdminUserFilter(userId: string) {
    const subAdmin: any = await User.findById(userId).lean();
    if (!subAdmin || subAdmin.role !== 'sub-admin') {
        return null;
    }

    const locationQuery: any = {};
    if (subAdmin.state) locationQuery.state = subAdmin.state;
    if (subAdmin.city) locationQuery.city = subAdmin.city;
    if (subAdmin.zipcode) locationQuery.zipcode = subAdmin.zipcode;

    const conditions: any[] = [{ createdBy: new mongoose.Types.ObjectId(userId) }];
    if (Object.keys(locationQuery).length > 0) {
        conditions.push(locationQuery);
    }

    return { $or: conditions };
}

export async function getSubAdminTextLocationFilter(userId: string, locationField: string = 'location') {
    const subAdmin: any = await User.findById(userId).lean();
    if (!subAdmin || subAdmin.role !== 'sub-admin') {
        return null;
    }

    const state = subAdmin.state || '';
    const city = subAdmin.city || '';
    const zipcode = subAdmin.zipcode || '';

    const conditions = [];
    if (city) conditions.push({ [locationField]: { $regex: new RegExp(city, 'i') } });
    if (state) conditions.push({ [locationField]: { $regex: new RegExp(state, 'i') } });
    if (zipcode) conditions.push({ [locationField]: { $regex: new RegExp(zipcode, 'i') } });

    if (conditions.length === 0) {
        return { createdBy: new mongoose.Types.ObjectId(userId) };
    }

    return {
        $or: [
            { createdBy: new mongoose.Types.ObjectId(userId) },
            ...conditions
        ]
    };
}

