'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track in production or ignore if needed, but for MVP we track everything
    // except admin routes
    if (pathname && !pathname.startsWith('/admin')) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch(err => console.error('Failed to log visit', err));
    }
  }, [pathname]);

  return null; // Silent component
}
