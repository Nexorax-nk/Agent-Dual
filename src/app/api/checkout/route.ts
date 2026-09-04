import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { addressId, paymentMethodId } = await request.json();
    
    // Mock user
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId,
        paymentMethodId,
        status: "Pending Approval",
        total,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtBuy: item.product.price
          }))
        }
      }
    });

    // Clear the cart
    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
