'use client';

import { useState } from 'react';
import { usePWAInstall } from '@/components/PWAInstallProvider';

export default function InstallBanner() {
  const { isInstallable, promptInstall, isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) return null;

  return (
    <div style={styles.banner}>
      <span>Installez notre application pour une meilleure expérience !</span>
      <div style={styles.buttonContainer}>
        <button onClick={promptInstall} style={styles.installButton}>
          Installer
        </button>
        <button onClick={() => setDismissed(true)} style={styles.laterButton}>
          Plus tard
        </button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    position: 'fixed' as const,
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
    backgroundColor: '#1E293B', // Bleu foncé chaleureux
    color: '#FFFFFF',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
  },
  buttonContainer: {
    display: 'flex',
    gap: '0.5rem',
  },
  installButton: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: 'bold'  as const,
    cursor: 'pointer',
  },
  laterButton: {
    backgroundColor: '#4B5563', // Gris neutre doux
    color: '#FFFFFF',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
  },
};
