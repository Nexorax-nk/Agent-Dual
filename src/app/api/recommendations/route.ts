import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const recs = await prisma.recommendation.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(recs);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, reason } = await request.json();
    
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const rec = await prisma.recommendation.create({
      data: {
        userId: user.id,
        productId,
        reason
      },
      include: { product: true }
    });

    return NextResponse.json({ success: true, recommendation: rec });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save recommendation' }, { status: 500 });
  }
}
