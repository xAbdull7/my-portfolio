'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track in production or ignore if needed, but for MVP we track everything
    // except admin routes
    if (pathname && !pathname.startsWith('/admin')) {
      // 1. Initial Page Visit (stores historical data)
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch(err => console.error('Failed to log visit', err));

      // 2. Initial Ping (immediately registers as an active visitor)
      fetch('/api/analytics/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => {});

      // 3. Heartbeat (keeps the visitor active while they stay on the page)
      const interval = setInterval(() => {
        fetch('/api/analytics/live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname }),
        }).catch(() => {});
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [pathname]);

  return null; // Silent component
}

