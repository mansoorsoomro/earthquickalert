import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmergencyPlan from '@/models/EmergencyPlan';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        await connectDB();
        const plans = await EmergencyPlan.find({});
        const dataMap = plans.reduce((acc, plan) => {
            acc[plan.planId] = {
                id: plan._id,
                label: plan.label,
                overview: plan.overview,
                steps: plan.steps,
                attachments: plan.attachments
            };
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json({ success: true, data: dataMap });
    } catch (error) {
        console.error('Fetch EmergencyPlans error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch plans' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        // Use FormData to parse incoming multipart/form-data for file uploads
        const formData = await req.formData();
        const planId = formData.get('planId') as string;
        const file = formData.get('file') as File;

        if (!planId || !file) {
            return NextResponse.json({ success: false, error: 'Missing plan ID or file' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define directory to save
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (dirError) {
            // ignore if exists
        }

        const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const filePath = join(uploadDir, uniqueFilename);

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/${uniqueFilename}`;

        let plan = await EmergencyPlan.findOne({ planId });
        if (!plan) {
            plan = new EmergencyPlan({
                planId,
                label: planId.replace(/_/g, ' ').toUpperCase(),
                overview: `Uploaded Emergency Plan Documents for ${planId}`,
                steps: [],
                attachments: []
            });
        }

        plan.attachments.push({
            fileName: file.name,
            fileUrl: fileUrl,
            size: buffer.length,
            uploadedAt: new Date()
        });

        await plan.save();

        return NextResponse.json({ success: true, message: 'File uploaded successfully', data: plan });
    } catch (error) {
        console.error('EmergencyPlan POST error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
