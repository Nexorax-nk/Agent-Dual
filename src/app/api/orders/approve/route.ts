import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const order = await prisma.order.update({
      where: { id: orderId, userId: user.id },
      data: { status: 'Processing' }
    });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to approve order' }, { status: 500 });
  }
}
