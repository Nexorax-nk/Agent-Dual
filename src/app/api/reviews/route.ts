import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, message: 'Review successfully submitted.', data: body });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
