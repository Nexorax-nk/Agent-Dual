import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { street, city, country } = await request.json();
    
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        street,
        city,
        country
      }
    });

    return NextResponse.json({ success: true, message: "Address saved", data: address });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json(addresses);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    await prisma.address.delete({
      where: {
        id,
        userId: user.id // ensure user owns the address
      }
    });

    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

