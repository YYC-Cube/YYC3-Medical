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
        // 尝试注册 Background Sync（浏览器不支持时静默跳过）
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then(registration => {
              return (
                registration as ServiceWorkerRegistration & {
                  sync: { register: (tag: string) => Promise<void> };
                }
              ).sync.register('background-sync');
            })
            .catch(() => {
              // Background Sync 被浏览器禁用或不支持，忽略即可
            });
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
