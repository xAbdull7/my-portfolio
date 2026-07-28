import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const techStack = await prisma.techStack.findUnique({
      where: { id: 'default' },
    });
    return NextResponse.json(techStack);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const updatedTechStack = await prisma.techStack.update({
      where: { id: 'default' },
      data: {
        languages: data.languages,
        data: data.data,
        web: data.web,
        devops: data.devops,
      }
    });
    revalidatePath('/');
    return NextResponse.json(updatedTechStack);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
