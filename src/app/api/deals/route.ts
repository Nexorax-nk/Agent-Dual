import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const deals = await prisma.product.findMany({
      where: { stars: { gte: 4.5 } },
      take: 10,
      orderBy: { reviews: 'desc' }
    });
    return NextResponse.json(deals);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
