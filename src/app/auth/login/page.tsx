'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../AuthLayout';
import CenteredCard from '@/components/CenteredCard';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Échec de connexion. Vérifie tes identifiants.');
    }
  };

  return (
    <AuthLayout>
      <CenteredCard>
        <h1 style={styles.title}>Connexion</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" style={styles.submitButton}>
            Se connecter
          </button>
        </form>
        <p style={styles.linkText}>
          Pas encore de compte ? <Link href="/auth/signup">S’inscrire</Link>
        </p>
      </CenteredCard>
    </AuthLayout>
  );
}

const styles = {
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    textAlign: 'center' as const,
    marginBottom: '1rem',
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '100%',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
  },
  passwordWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  submitButton: {
    backgroundColor: '#1f2a38',
    color: '#fff',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  linkText: {
    textAlign: 'center' as const,
    marginTop: '1rem',
  },
   link: {
    color: '#6b7280', // Gris neutre (peut-être #4b5563 si tu veux plus foncé)
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s, filter 0.2s',
  } as React.CSSProperties,
};
