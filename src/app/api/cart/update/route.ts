import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json();
    let user = await prisma.user.findFirst();
    
    if (user) {
      if (quantity === 0) {
        await prisma.cartItem.delete({
          where: { userId_productId: { userId: user.id, productId } }
        }).catch(() => {});
      } else {
        await prisma.cartItem.update({
          where: { userId_productId: { userId: user.id, productId } },
          data: { quantity }
        }).catch(() => {});
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
