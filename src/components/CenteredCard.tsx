export default function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.card}>
      {children}
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    padding: '3rem 4rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
};
