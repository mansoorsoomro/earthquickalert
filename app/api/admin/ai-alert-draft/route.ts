import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { openaiService } from '@/lib/services/openai-service';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
        }

        const { alertType, context } = await req.json();

        if (!alertType) {
            return NextResponse.json({ error: 'Alert type is required.' }, { status: 400 });
        }

        const message = await openaiService.generateAlertLanguage(alertType, context);

        return NextResponse.json({ success: true, message });
    } catch (error: any) {
        console.error('AI draft error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
