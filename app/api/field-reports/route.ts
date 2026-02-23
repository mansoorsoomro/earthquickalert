import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FieldReport from '@/models/FieldReport';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const reports = await FieldReport.find()
            .sort({ createdAt: -1 })
            .lean();

        // Transform for UI (e.g., date formatting)
        const formattedReports = reports.map(rep => ({
            id: rep._id.toString(),
            name: rep.name,
            category: rep.category,
            // Format "20/Dec/2025" style for table
            date: new Date(rep.incidentDate).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            }).replace(/ /g, '/'),
            file: rep.fileReference,
            status: rep.status,
        }));

        return NextResponse.json({
            success: true,
            data: formattedReports,
        });
    } catch (error) {
        console.error('Error fetching field reports:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch field reports' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, category, incidentDate, fileReference } = body;

        if (!name || !category || !incidentDate || !fileReference) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newReport = await FieldReport.create({
            name,
            category,
            incidentDate: new Date(incidentDate),
            fileReference,
            status: 'Review' // Default status per model
        });

        return NextResponse.json({
            success: true,
            data: newReport
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating field report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create field report' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields `id` or `status`' },
                { status: 400 }
            );
        }

        const updatedReport = await FieldReport.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedReport) {
            return NextResponse.json(
                { success: false, error: 'Report not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedReport
        });
    } catch (error) {
        console.error('Error updating field report:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update field report' },
            { status: 500 }
        );
    }
}
