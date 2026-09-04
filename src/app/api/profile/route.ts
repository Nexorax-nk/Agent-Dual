import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        addresses: true,
        paymentMethods: true
      }
    });
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email
      },
      addresses: user.addresses,
      paymentMethods: user.paymentMethods
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
