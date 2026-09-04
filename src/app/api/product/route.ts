import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const asin = searchParams.get('asin');
    if (!asin) return NextResponse.json({ error: 'ASIN required' }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { asin } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
