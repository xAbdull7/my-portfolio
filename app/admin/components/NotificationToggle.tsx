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
        navigator.serviceWorker.ready.then(registration => {
          registration.pushManager.getSubscription().then(subscription => {
            setIsSubscribed(!!subscription);
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

  const subscribeUser = async () => {
    setLoading(true);
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        alert('يرجى السماح بالإشعارات من إعدادات المتصفح');
        setLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!publicVapidKey) {
        alert('مفاتيح VAPID غير موجودة، اتصل بالمطور.');
        setLoading(false);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
      alert('حدث خطأ أثناء تفعيل الإشعارات');
    }
    setLoading(false);
  };

  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return null; // Push not supported
  }

  return (
    <button 
      onClick={!isSubscribed ? subscribeUser : undefined}
      disabled={isSubscribed || loading}
      className={`p-3 md:px-4 md:py-2.5 rounded-2xl md:rounded-full font-semibold transition-all flex items-center justify-center gap-2 text-sm shadow-sm
        ${isSubscribed 
          ? 'bg-zinc-100 dark:bg-white/5 text-green-600 dark:text-green-400 cursor-default' 
          : 'bg-zinc-900 text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95'
        } ${loading ? 'opacity-50' : ''}`}
      title={isSubscribed ? "الإشعارات مفعلة" : "تفعيل الإشعارات"}
    >
      {isSubscribed ? (
        <>
          <BellRing size={18} className="animate-pulse" /> 
          <span className="hidden md:inline">الإشعارات مفعلة</span>
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
