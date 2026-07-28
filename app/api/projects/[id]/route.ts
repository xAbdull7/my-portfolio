import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        badge: data.badge,
        link: data.link,
        linkText: data.linkText,
        icon: data.icon,
        tags: data.tags,
        stats: data.stats,
        order: data.order,
        published: data.published,
      }
    });
    revalidatePath('/');
    return NextResponse.json(updatedProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath('/');
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
