import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 'default' },
      select: { resumeUrl: true }
    });

    if (!profile?.resumeUrl) {
      return new NextResponse('Resume not found', { status: 404 });
    }

    // Check if it's a base64 data URL
    if (profile.resumeUrl.startsWith('data:')) {
      const base64Data = profile.resumeUrl.split(',')[1];
      const mimeType = profile.resumeUrl.split(';')[0].split(':')[1];
      
      const buffer = Buffer.from(base64Data, 'base64');
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType || 'application/pdf',
          'Content-Disposition': 'inline; filename="Resume.pdf"', // inline displays it in browser, attachment forces download
        }
      });
    }

    // If it's a standard URL (like Google Drive), just redirect to it
    return NextResponse.redirect(profile.resumeUrl);
    
  } catch (error: any) {
    console.error('Error fetching resume:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
