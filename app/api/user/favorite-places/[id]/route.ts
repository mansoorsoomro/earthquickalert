import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const session = await getSession();

        if (!session || !session.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            {
                $pull: { favoritePlaces: { _id: id } }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Place deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting favorite place:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
