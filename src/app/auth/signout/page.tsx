'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CenteredCard from '@/components/CenteredCard';
import AuthLayout from '../../AuthLayout';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Déconnexion auto avec redirection après 2s
    signOut({ redirect: false }).then(() => {
      setTimeout(() => {
        router.push('/');
      }, 2000); // délai pour afficher le message
    });
  }, [router]);

  return (
     <AuthLayout>
    <CenteredCard>
      <h1 style={styles.title}>Déconnexion en cours...</h1>
      <p style={styles.text}>Vous allez être redirigé(e) vers la page d’accueil.</p>
    </CenteredCard>
    </AuthLayout>
  );
}

const styles = {
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
  text: {
    textAlign: 'center' as const,
    color: '#666',
  },
};
