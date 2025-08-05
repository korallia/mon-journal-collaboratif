import Link from 'next/link';
import InstallBanner from '@/components/InstallBanner';

export default function HeroSection() {
  return (
    <div style={styles.container}>
      <div style={styles.card as React.CSSProperties}>
        <h1 style={styles.title}>Mon Journal Collaboratif</h1>
        <p style={styles.subtitle}>
          Votre espace pour organiser, planifier et collaborer en toute simplicité.
        </p>
        <Link href="/auth/login" style={styles.button}>
          Se connecter
        </Link>
        <InstallBanner />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fb',
    padding: '2rem',
    backgroundColor: "#E5E5E5",
  },
  card: {
    background: '#ffffff',
    padding: '3rem 4rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    marginBottom: '2rem',
  },
  button: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
};
