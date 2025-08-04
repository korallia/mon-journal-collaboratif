'use client';

import { useEffect } from 'react';

export default function PWAWrapper() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker registration skipped in development');
      return;
    }

    if ('serviceWorker' in navigator) {
      Promise.resolve().then(() => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    } else {
      console.warn('Service Worker API not supported in this browser.');
    }
  }, []);

  return null;
}
