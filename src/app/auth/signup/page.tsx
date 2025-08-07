'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../AuthLayout';
import CenteredCard from '@/components/CenteredCard';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
    setError("Les mots de passe ne correspondent pas.")
    return
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username, email, password }),
    });

    if (res.ok) {
      setSuccess('Compte créé avec succès !');
      setTimeout(() => router.push('/auth/login'), 1500);
    } else {
      setError('Une erreur est survenue. Essayez à nouveau.');
    }
  };

  return (
    <AuthLayout>
      <CenteredCard>
        <h1 style={styles.title}>Créer un compte</h1>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input} // mêmes styles que les autres champs
          />
          <button type="submit" style={styles.submitButton}>
            S’inscrire
          </button>
        </form>
        <p style={styles.linkText}>
          Déjà inscrit ? <Link href="/auth/login">Se connecter</Link>
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
  success: {
    color: 'green',
    textAlign: 'center' as const,
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
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
