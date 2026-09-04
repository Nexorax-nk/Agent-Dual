import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Mock user auth
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Demo User', email: 'demo@webmcpstore.com' }
      });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    return NextResponse.json(cartItems);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity, addedBy } = await request.json();
    
    // Mock user auth
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Demo User', email: 'demo@webmcpstore.com' }
      });
    }

    // Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId: user.id,
        productId,
        quantity,
        addedBy: addedBy || "user"
      }
    });

    return NextResponse.json(cartItem);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('id');

    if (cartItemId) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      // Clear all
      let user = await prisma.user.findFirst();
      if (user) {
        await prisma.cartItem.deleteMany({ where: { userId: user.id } });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete from cart' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { cartItemId, quantity } = await request.json();
    
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      return NextResponse.json({ success: true });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });

    return NextResponse.json(cartItem);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update cart quantity' }, { status: 500 });
  }
}

