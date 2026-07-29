import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Increment duration by 5 seconds
    await prisma.pageVisit.update({
      where: { id: data.id },
      data: {
        duration: {
          increment: 5
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
