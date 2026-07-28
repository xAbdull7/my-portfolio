import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        badge: data.badge,
        link: data.link,
        linkText: data.linkText,
        icon: data.icon,
        tags: data.tags || [],
        stats: data.stats || null,
        order: data.order || 0,
      }
    });
    revalidatePath('/');
    return NextResponse.json(newProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
