import InstallBanner from '@/components/InstallBanner';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.container}>
      {children}
       <InstallBanner />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e2e2', // Gris chaleureux
  } as React.CSSProperties,
};
