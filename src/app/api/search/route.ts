import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category') || '';

    let products: any[] = [];
    if (query || category) {
      products = await prisma.$queryRaw`
        SELECT * FROM "Product"
        WHERE "title" LIKE ${'%' + query + '%'}
        ${category ? Prisma.sql`AND "category" LIKE ${'%' + category + '%'}` : Prisma.empty}
        ORDER BY "reviews" DESC
        LIMIT 40
      `;
    } else {
      products = await prisma.product.findMany({
        take: 40,
        orderBy: { reviews: 'desc' }
      });
    }

    return NextResponse.json({ results: products });
  } catch (error) {
    console.error("Database Search Error:", error);
    return NextResponse.json({ error: "Failed to search catalog" }, { status: 500 });
  }
}
