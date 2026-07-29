import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 'default' },
    });
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const updatedProfile = await prisma.profile.update({
      where: { id: 'default' },
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio,
        resumeUrl: data.resumeUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        twitterUrl: data.twitterUrl,
        emailUrl: data.emailUrl,
        softSkills: data.softSkills,
        languages: data.languages,
        eduMajor: data.eduMajor,
        eduUni: data.eduUni,
        eduYear: data.eduYear,
        timeline: data.timeline,
        spotifyPlaylist: data.spotifyPlaylist,
        spotifySong: data.spotifySong,
        spotifyExplicit: data.spotifyExplicit,
      }
    });
    revalidatePath('/');
    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
