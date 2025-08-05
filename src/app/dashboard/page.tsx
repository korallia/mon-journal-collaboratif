'use client';

import { signOut, useSession } from 'next-auth/react';
import CenteredCard from '@/components/CenteredCard';
import AuthLayout from '../AuthLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session,status } = useSession();
   const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }



  return (
    <AuthLayout>
    <CenteredCard>
      <h1 style={styles.title}>Bienvenue, {session?.user?.name || 'Utilisateur'} !</h1>
      <p style={styles.subtitle}>
        Vous êtes connecté en tant que {session?.user?.email}
      </p>
      <button onClick={() => router.push('/auth/signout')} style={styles.logoutButton}>
        Se déconnecter
      </button>
    </CenteredCard>
    </AuthLayout>
  );
}

const styles = {
  title: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    textAlign: 'center' as const,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem',
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  logoutButton: {
    backgroundColor: '#1f2a38',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
};
