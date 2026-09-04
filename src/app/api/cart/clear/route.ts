import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    let user = await prisma.user.findFirst();
    if (user) {
      await prisma.cartItem.deleteMany({ where: { userId: user.id } });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
