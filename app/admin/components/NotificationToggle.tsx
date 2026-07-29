'use client';
import { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';

export default function NotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(() => {
          navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription().then(subscription => {
              setIsSubscribed(!!subscription);
            });
          });
        });
      }
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted' && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
        });

        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });

        if (res.ok) {
          setIsSubscribed(true);
        } else {
          throw new Error('Failed to save subscription on server');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: subscription.endpoint })
          });
        }
      }
      setIsSubscribed(false);
    } catch (error) {
      console.error('Unsubscribe error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return null; // Push not supported
  }

  return (
    <button 
      onClick={!isSubscribed ? handleSubscribe : handleUnsubscribe}
      disabled={loading}
      className={`p-3 md:px-4 md:py-2.5 rounded-2xl md:rounded-full font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-sm hover:scale-105 active:scale-95 cursor-pointer
        ${isSubscribed 
          ? 'bg-zinc-100 dark:bg-white/5 text-green-600 dark:text-green-400' 
          : 'bg-zinc-900 text-white dark:bg-white dark:text-black'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
      title={isSubscribed ? "إلغاء الإشعارات" : "تفعيل الإشعارات"}
    >
      {isSubscribed ? (
        <>
          <BellOff size={18} /> 
          <span className="hidden md:inline">{loading ? 'جاري الإلغاء...' : 'إلغاء الإشعارات'}</span>
        </>
      ) : (
        <>
          <Bell size={18} />
          <span className="hidden md:inline">{loading ? 'جاري التفعيل...' : 'تفعيل الإشعارات'}</span>
        </>
      )}
    </button>
  );
}
