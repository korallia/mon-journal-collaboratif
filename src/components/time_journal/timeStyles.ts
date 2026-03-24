import type React from 'react';

const st: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 900,
    margin: '40px auto',
    padding: '0 16px',
  },

  hero: {
    backgroundColor: '#232e41ff',
    color: '#ffffff',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 24,
    boxShadow: '0 8px 20px rgba(2, 6, 23, 0.15)',
  },

  heroRow: {
     display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 20,
  minHeight: 72,
  position: 'relative',
  },

  heroLeft: {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  minWidth: 0,
  width: 260,
  paddingRight: 20,
  flexShrink: 0,
},

  heroRight: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
  minWidth: 0,
  paddingLeft: 8,
  
},

  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#334155',
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)',
    flexShrink: 0,
  },

  heroTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: 0,
    whiteSpace: 'nowrap',
  },

  heroSub: {
    opacity: 0.85,
    fontSize: 14,
    marginTop: 4,
  },

  btnGhostDark: {
    height: 40,
    display: 'inline-flex',
    alignItems: 'center',
  },

  

  

  projectName: {
   fontSize: '1.4rem',
  fontWeight: 700,
  color: '#ffffff',
  lineHeight: 1.2,
  paddingBottom: 2,
  textAlign: 'center'
  },




  lastEntryValue: {
  fontSize: '0.9rem',
  fontWeight: 500,
  color: '#cbd5e1',
  lineHeight: 1.3,
  paddingTop: 4,
  },

  projectPicker: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  pickerLabel: {
    color: '#6b7280',
    fontWeight: 600,
  },

  select: {
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#0f172a',
    outline: 'none',
  },

  stack: {
    display: 'grid',
    gap: 16,
    paddingTop: 16,
  },

  card: {
    background: '#1E293B',
    color: '#dbe4f0ff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 8px 20px rgba(2, 6, 23, 0.15)',
  },

  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  cardTitle: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 700,
    paddingBottom: 10,
  },

  formRow: {
    display: 'grid',
    gap: 8,
    marginBottom: 8,
    gridTemplateColumns: '1fr',
  },

  formRowDesktop: {
    display: 'grid',
    gap: 8,
    marginBottom: 8,
    gridTemplateColumns: '1fr 140px 90px 90px',
  },

  input: {
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    outline: 'none',
    background: '#fff',
    color: '#0f172a',
  },

  textarea: {
    width: '100%',
    minHeight: 90,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#0f172a',
    outline: 'none',
    marginBottom: 10,
    resize: 'vertical',
  },

  actionsRow: {
    display: 'flex',
    gap: 8,
  },

  entryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 8,
  },

  entryItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#2B3E59',
    color: '#F4F8FF',
    borderRadius: 10,
    padding: '10px 12px',
    boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.15)',
  },

  entryTitle: {
    fontWeight: 600,
    marginBottom: 2,
    marginTop: 6,
  },

  entryMeta: {
    fontSize: 12,
    opacity: 0.8,
  },

  itemActions: {
    display: 'flex',
    gap: 8,
  },

  badge: {
    background: '#4169E1',
    color: '#dbe4f0ff',
    borderRadius: 9999,
    padding: '2px 8px',
    fontSize: 12,
    marginRight: 8,
    display: 'inline-block',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08)',
  },

  panelLight: {
    background: '#e9eff6',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(15,23,42,0.06)',
    boxShadow: '0 2px 8px rgba(2,6,23,0.06)',
    marginBottom: 16,
  },

  panelTitle: {
    margin: '0 0 12px 0',
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
  },

  pickerStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingTop: 10,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#b6c4d8',
    marginBottom: 6,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 10,
  },

  unitWrap: {
    position: 'relative',
  },

  unitBadge: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 12,
    color: '#475569',
    opacity: 0.9,
    pointerEvents: 'none',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08)',
  },

  helpText: {
    fontSize: 12,
    color: '#9fb0c6',
    marginTop: 4,
    marginBottom: 4,
  },

  badgeRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  badgeBase: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 22,
    padding: '0 10px',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 9999,
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12)',
    transition: 'transform .12s ease, filter .12s ease',
  },

  badgeProject: {
    background: '#4169E1',
    color: '#E9F1FF',
    cursor: 'default',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08)',
  },

  badgeTask: {
    background: 'rgba(148, 163, 184, 0.64)',
    color: '#E5ECF5',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08)',
  },

  badgeHours: {
    background: 'rgba(22, 163, 74, 0.64)',
    color: '#CFF6D4',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08)',
  },

  badgeDate: {
    background: 'rgba(99, 101, 241, 0.64)',
    color: '#E7E9FF',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.08)',
  },

  refreshBtn: {
    height: 36,
    padding: '0 12px',
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },

  refreshIcon: {
    width: 16,
    height: 40,
    gap: 8,
    display: 'inline-block',
    transformOrigin: '50% 50%',
  },
  separator: {
  width: '100%',
  height: '1px',
  background: 'rgba(255, 255, 255, 245)',
},
 LeftBlock: {
   paddingLeft: '5px',

},

  
};




export default st;

export const headerMobileFix = `
  @media (max-width: 590px) {

    /* Structure verticale */
    .heroRow {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: flex-start !important;
      gap: 14px !important;
    }

    /* Bloc gauche full width */
    .heroLeft {
      width: 100% !important;
      min-width: 0 !important;
        padding-left: 20xp;
    }

    /* Bloc projet aligné avec le texte (offset de l’icône) */
    .centerblock {
      position: static !important;
      left: auto !important;
      transform: none !important;

      width: 100% !important;
      min-width: 0 !important;
      margin-top: 0 !important;

      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      justify-content: flex-start !important;
      text-align: left !important;
      gap: 4px !important;

      padding-left: 70px !important; /* 🔥 alignement */
    }

    /* On cache la ligne en mobile */
    .mobile-separator {
      display: none !important;
    }

    /* Bouton aligné avec le texte */
    .heroRight {
      width: 100% !important;
      display: flex !important;
      justify-content: flex-start !important;

      padding-left: 65px !important; /* 🔥 même alignement */
    }

    .heroRight a {
      width: fit-content !important;
    }
    .LeftBlock {
    padding-left: 30px;
    }
  }
`;