import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { cardType, last4 } = await request.json();
    
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const payment = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        cardType,
        last4
      }
    });

    return NextResponse.json({ success: true, message: "Card saved", data: payment });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save card' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const payments = await prisma.paymentMethod.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json(payments);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });

    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    await prisma.paymentMethod.delete({
      where: {
        id,
        userId: user.id // ensure user owns it
      }
    });

    return NextResponse.json({ success: true, message: "Payment method deleted" });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
}

