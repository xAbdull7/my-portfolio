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
      className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between border cursor-pointer
        ${isSubscribed 
          ? 'bg-zinc-100/80 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700' 
          : 'bg-zinc-100/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
      title={isSubscribed ? "Disable push notifications" : "Enable push notifications"}
    >
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${isSubscribed ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-500'}`}>
          {isSubscribed ? <BellRing size={14} className="text-zinc-800 dark:text-zinc-200" /> : <Bell size={14} />}
        </div>
        <span className="font-medium tracking-tight">
          {loading ? 'Updating...' : isSubscribed ? 'Push Alerts' : 'Enable Alerts'}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${isSubscribed ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
          {isSubscribed ? 'ON' : 'OFF'}
        </span>
      </div>
    </button>
  );
}
