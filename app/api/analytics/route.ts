import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// POST: Public endpoint to log a page visit
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Ignore dev visits or bot paths if necessary, but keep it simple for MVP
    await prisma.pageVisit.create({
      data: {
        path: data.path || '/',
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Fail silently for tracking
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Admin endpoint to fetch analytics data
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const visits = await prisma.pageVisit.findMany({
      orderBy: { visitedAt: 'desc' }
    });
    
    // Basic aggregation
    const totalVisits = visits.length;
    
    // Calculate today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = visits.filter(v => new Date(v.visitedAt) >= today).length;

    return NextResponse.json({
      totalVisits,
      todayVisits,
      recentVisits: visits.slice(0, 50) // Just returning the last 50 visits for simplicity
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
