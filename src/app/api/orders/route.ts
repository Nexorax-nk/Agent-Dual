import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map to expected format
    const formatted = orders.map(order => ({
      id: order.id,
      date: order.createdAt.toLocaleDateString(),
      total: order.total,
      status: order.status,
      items: order.items.map(item => ({
        product: {
          title: item.product.title,
          asin: item.product.asin
        },
        quantity: item.quantity
      }))
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
