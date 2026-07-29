import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';

// POST: Client pings to say "I'm alive"
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Create a simple hash of IP
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const cityHeader = req.headers.get('x-vercel-ip-city');
    const city = cityHeader ? decodeURIComponent(cityHeader) : 'Unknown';

    await prisma.liveVisitor.upsert({
      where: { ipHash },
      update: {
        lastActive: new Date(),
        path: data.path || '/',
        country,
        city,
      },
      create: {
        ipHash,
        lastActive: new Date(),
        path: data.path || '/',
        country,
        city,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Admin fetches active visitors
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Delete stale visitors (inactive for > 2 minutes)
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    await prisma.liveVisitor.deleteMany({
      where: { lastActive: { lt: twoMinsAgo } }
    });

    const activeVisitors = await prisma.liveVisitor.findMany({
      orderBy: { lastActive: 'desc' }
    });

    return NextResponse.json({ 
      count: activeVisitors.length,
      visitors: activeVisitors 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
