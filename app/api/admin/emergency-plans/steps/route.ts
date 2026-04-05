import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmergencyPlan from '@/models/EmergencyPlan';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { planId, steps } = await req.json();

        if (!planId || !Array.isArray(steps)) {
            return NextResponse.json({ success: false, error: 'Missing plan ID or valid steps array' }, { status: 400 });
        }

        let plan = await EmergencyPlan.findOne({ planId });
        if (!plan) {
            plan = new EmergencyPlan({
                planId,
                label: planId.replace(/_/g, ' ').toUpperCase(),
                overview: `Emergency Plan for ${planId}`,
                steps: steps,
                attachments: []
            });
        } else {
            plan.steps = steps;
        }

        await plan.save();

        return NextResponse.json({ success: true, message: 'Steps updated successfully', data: plan });
    } catch (error) {
        console.error('EmergencyPlan Steps POST error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
