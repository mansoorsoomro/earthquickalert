import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const response = NextResponse.json({ success: true });

    (await cookies()).delete('session');
    (await cookies()).delete('userRole');

    return response;
}
