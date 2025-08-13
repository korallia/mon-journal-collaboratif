import type React from 'react';

const st: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: '40px auto', padding: '0 16px' },
  hero: {
    backgroundColor: '#232e41ff',
    color: '#ffffff',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 24,
    boxShadow: '0 8px 20px rgba(2, 6, 23, 0.15)',
  },
  heroRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  heroLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  heroRight: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#334155', color: '#fff', fontWeight: 700, fontSize: 18,
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)',
  },
  heroTitle: { fontSize: '1.25rem', fontWeight: 700, margin: 0 },
  heroSub: { opacity: 0.85, fontSize: 14, marginTop: 2 },
  btnGhostDark: { height: 40, display: 'inline-flex', alignItems: 'center' },

  projectPicker: {
    display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  pickerLabel: { color: '#6b7280', fontWeight: 600 },
  select: {
    padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', color: '#0f172a', outline: 'none',
  },

  stack: { display: 'grid', gap: 16 },
  card: {
    background: '#232e41ff', color: '#dbe4f0ff', borderRadius: 16, padding: 16,
    boxShadow: '0 8px 20px rgba(2, 6, 23, 0.15)',
  },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { margin: 0, fontSize: '1.05rem', fontWeight: 700 },

  formRow: { display: 'grid', gridTemplateColumns: '1fr 140px 90px 90px', gap: 8, marginBottom: 8 },
  input: {
    padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', background: '#fff', color: '#0f172a',
  },
  textarea: {
    width: '100%', minHeight: 90, padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db',
    background: '#fff', color: '#0f172a', outline: 'none', marginBottom: 10, resize: 'vertical',
  },
  actionsRow: { display: 'flex', gap: 8 },

  entryList: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 },
  entryItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#2B3E59', color: '#F4F8FF', borderRadius: 10, padding: '10px 12px',
    boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.15)',
  },
  entryTitle: { fontWeight: 600, marginBottom: 2 },
  entryMeta: { fontSize: 12, opacity: 0.8 },
  itemActions: { display: 'flex', gap: 8 },

  badge: {
    background: '#4169E1', color: '#dbe4f0ff', borderRadius: 9999, padding: '2px 8px', fontSize: 12,
    marginRight: 8, display: 'inline-block',
  },

  panelLight: {
    background: '#e9eff6',                 // même vibe bleu très pâle
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(15,23,42,0.06)',
    boxShadow: '0 2px 8px rgba(2,6,23,0.06)',
    marginBottom: 16,                       // même écart vertical sous la bande
  },
  panelTitle: {
    margin: '0 0 12px 0',
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
  },

  // Empilement vertical label + champ
  pickerStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingTop:10,
  },
};
export default st;