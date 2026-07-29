import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// In-memory rate limiting (per cold-start worker)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // max 5 messages per hour per IP

// POST: Public endpoint to submit a contact message
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    
    // Check rate limit
    const userRateLimit = rateLimitMap.get(ip);
    if (userRateLimit) {
      if (now < userRateLimit.resetTime) {
        if (userRateLimit.count >= MAX_REQUESTS) {
          return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }
        userRateLimit.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const data = await req.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const messageRecord = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      }
    });

    // Send push notification to all admins
    try {
      const webpush = require('web-push');
      
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const privateVapidKey = process.env.VAPID_PRIVATE_KEY;
      const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

      if (publicVapidKey && privateVapidKey) {
        webpush.setVapidDetails(vapidSubject, publicVapidKey, privateVapidKey);

        const subscriptions = await prisma.pushSubscription.findMany();
        
        const payload = JSON.stringify({
          title: 'رسالة جديدة من محفظتك!',
          body: `من: ${data.name}\n${data.message.substring(0, 50)}...`,
          url: '/admin/messages'
        });

        await Promise.all(subscriptions.map(async (sub) => {
          try {
            await webpush.sendNotification({
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            }, payload);
          } catch (e: any) {
            if (e.statusCode === 410 || e.statusCode === 404) {
              // Subscription has expired or is no longer valid
              await prisma.pushSubscription.delete({ where: { id: sub.id } });
            } else {
              console.error('Error sending push notification', e);
            }
          }
        }));
      }
    } catch (pushError) {
      console.error('Failed to trigger push notifications:', pushError);
      // We don't fail the message creation if push fails
    }

    return NextResponse.json({ success: true, message: messageRecord });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Admin endpoint to fetch messages
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
