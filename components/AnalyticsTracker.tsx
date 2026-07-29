'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const visitIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin')) {
      // 1. Initial Page Visit
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          visitIdRef.current = data.id;
        }
      })
      .catch(err => console.error('Failed to log visit', err));

      // 2. Initial Ping for Live Visitors
      fetch('/api/analytics/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => {});

      // 3. Heartbeat every 5 seconds
      const interval = setInterval(() => {
        // Live tracking
        fetch('/api/analytics/live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname }),
        }).catch(() => {});

        // Session duration ping
        if (visitIdRef.current) {
          fetch('/api/analytics/ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: visitIdRef.current }),
          }).catch(() => {});
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [pathname]);

  return null; // Silent component
}

