import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

import { UAParser } from 'ua-parser-js';
import crypto from 'crypto';

// POST: Public endpoint to log a page visit
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Extract headers for advanced analytics
    const userAgent = req.headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';
    const deviceType = parser.getDevice().type || (os === 'iOS' || os === 'Android' ? 'Mobile' : 'Desktop');
    
    // Vercel specific geo headers
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';
    
    // Create a simple hash of IP to track unique visitors without storing raw IPs
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    
    // Ignore bots
    if (userAgent.toLowerCase().includes('bot')) {
       return NextResponse.json({ success: true, ignored: true });
    }

    await prisma.pageVisit.create({
      data: {
        path: data.path || '/',
        browser,
        os,
        device: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
        country,
        city,
        ipHash
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
    const todayVisits = visits.filter((v: any) => new Date(v.visitedAt) >= today).length;

    return NextResponse.json({
      totalVisits,
      todayVisits,
      recentVisits: visits.slice(0, 50) // Just returning the last 50 visits for simplicity
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
