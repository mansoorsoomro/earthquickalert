import { NextResponse } from 'next/server';
import { openaiService } from '@/lib/services/openai-service';

export async function POST(req: Request) {
  try {
    const { alertType, context } = await req.json();

    if (!alertType) {
      return NextResponse.json({ error: 'Alert type is required' }, { status: 400 });
    }

    const message = await openaiService.generateAlertLanguage(alertType, context);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('AI alert generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate alert message' }, { status: 500 });
  }
}
