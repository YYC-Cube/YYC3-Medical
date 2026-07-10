'use client';

import { useEffect, useRef, useState } from 'react';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOfflineRef.current) {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then(registration => {
              return (
                registration as ServiceWorkerRegistration & {
                  sync: { register: (tag: string) => Promise<void> };
                }
              ).sync.register('background-sync');
            })
            .catch(console.error);
        }
        setWasOffline(false);
        wasOfflineRef.current = false;
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      wasOfflineRef.current = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // 空依赖数组：事件监听器只挂载一次，通过 ref 同步最新状态

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
  };
}
