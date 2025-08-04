'use client';

import { useState } from 'react';
import { usePWAInstall } from '@/components/PWAInstallProvider';

export default function InstallBanner() {
  const { isInstallable, promptInstall, isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded shadow-lg flex justify-between items-center">
      <span>Installez notre application pour une meilleure expérience !</span>
      <div className="flex gap-2">
        <button
          onClick={promptInstall}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Installer
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
