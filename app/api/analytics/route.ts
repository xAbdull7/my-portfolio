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
    const cityHeader = req.headers.get('x-vercel-ip-city');
    const city = cityHeader ? decodeURIComponent(cityHeader) : 'Unknown';
    
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
    
    const totalVisits = visits.length;
    
    // Unique Visitors
    const uniqueIps = new Set(visits.map(v => v.ipHash).filter(Boolean));
    const uniqueVisitors = uniqueIps.size;
    
    // Today's Visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = visits.filter((v: any) => new Date(v.visitedAt) >= today).length;

    // Top Pages
    const pathCounts: Record<string, number> = {};
    visits.forEach(v => {
      pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
    });
    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Geo Distribution
    const geoCounts: Record<string, number> = {};
    visits.forEach(v => {
      if (v.country && v.country !== 'Unknown') {
        geoCounts[v.country] = (geoCounts[v.country] || 0) + 1;
      }
    });
    const geoDistribution = Object.entries(geoCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
      
    // Device & Browser Distribution (for Donut Charts)
    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    visits.forEach(v => {
      const dev = v.device || 'Desktop';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
      if (v.browser && v.browser !== 'Unknown') browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
    });
    const deviceDistribution = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));
    const browserDistribution = Object.entries(browserCounts).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value - a.value).slice(0,5);

    // 7-day trend
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();
    
    const chartData = last7Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const count = visits.filter(v => {
        const vDate = new Date(v.visitedAt);
        return vDate >= date && vDate < nextDay;
      }).length;
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        visits: count
      };
    });

    // Heatmap Data (Last 365 Days)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Group visits by date for the heatmap
    // In a real app we might use Prisma groupBy, but since SQLite/Postgres vary, 
    // and visits aren't expected to be in the millions for a portfolio, we process in memory
    const heatmapCounts: Record<string, number> = {};
    const recentYearVisits = visits.filter(v => new Date(v.visitedAt) >= oneYearAgo);
    
    recentYearVisits.forEach(v => {
      const dateStr = new Date(v.visitedAt).toISOString().split('T')[0];
      heatmapCounts[dateStr] = (heatmapCounts[dateStr] || 0) + 1;
    });

    // Format for react-activity-calendar
    // Generate an array of all dates in the last year to ensure full coverage
    const heatmapData = [];
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = heatmapCounts[dateStr] || 0;
      let level = 0;
      if (count > 0) level = 1;
      if (count > 5) level = 2;
      if (count > 15) level = 3;
      if (count > 30) level = 4;
      heatmapData.push({ date: dateStr, count, level });
    }

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      todayVisits,
      topPages,
      geoDistribution,
      deviceDistribution,
      browserDistribution,
      chartData,
      heatmapData,
      recentVisits: visits.slice(0, 100)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Bulk or singular delete
export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    
    if (data.action === 'deleteAll') {
      await prisma.pageVisit.deleteMany();
      return NextResponse.json({ success: true, message: 'All visits deleted' });
    } else if (data.action === 'deleteSelected' && Array.isArray(data.ids)) {
      await prisma.pageVisit.deleteMany({
        where: { id: { in: data.ids } }
      });
      return NextResponse.json({ success: true, message: `Deleted ${data.ids.length} visits` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
