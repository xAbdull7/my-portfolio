import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

// PUT: Bulk update project orders
export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { projects } = await req.json(); // expected: [{ id, order }, ...]
    
    // Prisma does not support bulk update with different values easily, 
    // so we use a transaction of single updates
    const updates = projects.map((p: { id: string, order: number }) => 
      prisma.project.update({
        where: { id: p.id },
        data: { order: p.order }
      })
    );

    await prisma.$transaction(updates);
    revalidatePath('/');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
