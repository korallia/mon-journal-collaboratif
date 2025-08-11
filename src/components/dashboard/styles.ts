// src/components/dashboard/styles.ts

import type React from "react";

export const s: Record<string, React.CSSProperties> = {
  // Styles généraux
  container: { maxWidth: 900, margin: "40px auto", padding: "0 16px" },
  
  // Hero/banner
  hero: {
    backgroundColor: "#1E293B",
    color: "#FFFFFF",
    borderRadius: 16,
    padding: "20px 24px",
    marginBottom: 24,
    boxShadow: "0 8px 20px rgba(2, 6, 23, 0.15)",
  },
  heroRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  heroLeft: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#334155", color: "#fff", fontWeight: 700, fontSize: 18,
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)",
  },
  heroTitle: { fontSize: "1.5rem", fontWeight: 700, margin: 0 },
  heroSub: { opacity: 0.85, fontSize: 14, marginTop: 2 },
  
  // Alerts / text
  muted: { fontWeight: 300, color: "#A9B2B9", fontSize: '12px'},
  alert: {
    background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A",
    padding: 12, borderRadius: 8, marginBottom: 16,
  },
  
  // Cards
  card: { background: "#F7F7F7", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 16 },
  
  // Controls
  row: { display: "flex", gap: 8, alignItems: "center" },
  input: { flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db", outline: "none" },
  
  // Boutons
  primaryBtn: { border: "1px solid rgba(255,255,255,.35)" ,padding: "8px 12px", borderRadius: 8, background: "#4CAF50", color: "#E5EAF1", cursor: "pointer", marginLeft: 4 },
  dangerBtn:  { border: "1px solid rgba(255,255,255,.35)", padding: "8px 12px", borderRadius: 8, background: "#C62828", color: "#E5EAF1", cursor: "pointer", marginLeft: 4 },
  ghostBtn:   { padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#111827", cursor: "pointer", marginLeft: 4 },
  ghostBtnOnDark: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.35)",
    background: "transparent", backgroundColor: "#546E7A", color: "#E5EAF1", cursor: "pointer", marginLeft: 4,
  },
  secondaryBtnOnDark: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.35)",
    background: "#4169E1", color: "#FFFFFF", cursor: "pointer", marginLeft: 4,
  },
  outBtnOnDark: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.35)",
    background: "transparent", color: "#fff", cursor: "pointer",
  },
  
  // Table Projects
  projectPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 350px", // 5 colonnes flexibles et une colonne fixe pour les actions
    alignItems: "center",
    padding: "0 10px",
    marginBottom: "8px",
    borderBottom: "1px solid #e5e7eb",
    gap: "8px",
  },
  headerItem: {
    color: "#6b7280",
    fontWeight: 600,
    fontSize: "0.85rem",
    minWidth: '0', 
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  headerActions: {
    color: "#6b7280",
    fontWeight: 600,
    textAlign: "right",
    fontSize: "0.85rem",
  },
  projectRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 350px",
    alignItems: "center",
    background: "#1C2025",
    color: "#E5EAF1",
    padding: "10px 10px",
    borderRadius: 16,
    marginBottom: "8px",
    gap: "8px",
  },
  projectItem: {
    fontSize: "0.9rem",
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  projectActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    minWidth: '0',
  },

  // Styles de l'accordéon des tâches
  accordionCell: {
    padding: '14px',
    background: '#2B323B',
    borderRadius: 12,
    marginTop: '8px',
  },
  taskAddRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  taskList: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  taskItem: {
    background: '#1C2025',
    borderRadius: 12,
    padding: 14,
    color: '#E5EAF1',
    marginBottom: '8px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskLabel: {
    cursor: 'pointer',
    color: '#E5EAF1',
  }
};


export default s;