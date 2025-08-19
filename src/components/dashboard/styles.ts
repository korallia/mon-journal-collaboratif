import type React from "react";

/** Classe utilitaire à appliquer sur l’input pour cibler le placeholder */
export const classes = {
  textInput: "dash-text-input",
};

// CSS global pour styler les placeholders comme l’entête "Nom"
export const globalPlaceholderCss = `
  .${classes.textInput}::placeholder,
  .${classes.textInput}::-webkit-input-placeholder,
  .${classes.textInput}::-moz-placeholder,
  .${classes.textInput}:-ms-input-placeholder,
  .${classes.textInput}::-ms-input-placeholder {
    color: #6b7280 !important;
    font-weight: 600;
    letter-spacing: 0.01em;
    opacity: 1;
  }
  .${classes.textInput}:focus::placeholder {
    color: #94a3b8 !important;
    font-weight: 600;
  }
`;

export const s: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 'min(1120px, 96vw)',
    margin: "40px auto",
    padding: "0 16px",
  },

  // Hero/banner
  hero: {
    backgroundColor: "#232e41ff",
    color: "#FFFFFF",
    borderRadius: 16,
    padding: "20px 24px",
    marginBottom: 24,
    boxShadow: "0 8px 20px rgba(2, 6, 23, 0.15)",
  },
  heroRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  heroLeft: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#334155",
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
    boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)",
  },
  heroTitle: { fontSize: "1.5rem", fontWeight: 700, margin: 0 },
  heroSub: { opacity: 0.85, fontSize: 14, marginTop: 2 },

  topRight: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },

  // Labels / alerts
  muted: { fontSize: "12px", color: "#A8B6C9" },
  alert: {
    background: "#E5EAF1",
    color: "#92400E",
    border: "1px solid #FDE68A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },

  // Cards
  card: {
    background: "#E5EAF1",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
  },

  // Controls
  row: { display: "flex", gap: 8, alignItems: "center", color: "#111827" },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
    background: "#fff",
    color: "#0f172a",
  },

  // Tableau
  tableScroll: { width: "100%", overflowX: "visible" },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    tableLayout: "fixed",
  },
  th: {
    textAlign: "left",
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  // Lignes de projet
  projectRow: { background: "#232e41ff", color: "#dbe4f0ff", borderRadius: 16 },
  projectCell: { 
    padding: "8px 8px", 
    verticalAlign: "middle", 
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }, // un peu plus serré
  projectCellFirst: { borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  projectCellLast: { borderTopRightRadius: 16, borderBottomRightRadius: 16 },

  // Actions (desktop/table)
  projectActions: {
    display: "flex",
    gap: "6px", // plus serré pour économiser l’espace
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  // Boutons
  primaryBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    height: 40,
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,.35)",
    background: "#4CAF50",
    color: "#dbe4f0ff",
    cursor: "pointer",
    marginLeft: 4,
  },
  dangerBtn: {
    padding: "8px 12px",
    height: 40,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.35)",
    background: "#C62828",
    color: "#dbe4f0ff",
    cursor: "pointer",
    marginLeft: 4,
    lineHeight: 1,
  },
  ghostBtnOnDark: {
    padding: "8px 12px",
    height: 40,
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.35)",
    background: "transparent",
    backgroundColor: "#546E7A",
    color: "#dbe4f0ff",
    cursor: "pointer",
    marginLeft: 4,
  },
  secondaryBtnOnDark: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.35)",
    background: "#4169E1",
    color: "#dbe4f0ff",
    cursor: "pointer",
    marginLeft: 4,
  },
  outBtnOnDark: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.35)",
    background: "transparent",
    color: "#dbe4f0ff ",
    cursor: "pointer",
  },
  ghostBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    marginLeft: 4,
  },

  // Accordéon des tâches
  accordionCell: {
    background: "#3b4861ff",
    borderRadius: 12,
    padding: 14,
    color: "#dbe4f0ff",
    marginTop: "8px",
  },
  taskAddRow: { display: "flex", gap: 8, marginBottom: 10 },
  taskList: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 },
  taskItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#2B3E59",
    boxShadow: "inset 0 0 0 3px rgba(0, 0, 0, 0.15)",
    color: "#F4F8FF",
    borderRadius: 10,
    padding: "8px 10px",
    fontWeight: 600,
  },
  taskLabel: { display: "flex", alignItems: "center", gap: 8 },

  // Mobile cards
  listReset: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 },
  projectCard: { background: "#1E293B", color: "#dbe4f0ff", borderRadius: 16, padding: 12 },
  projectName: { fontWeight: 700, fontSize: "1rem", margin: "0 0 6px 0" },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 },
  metaLabel: { fontSize: 12, color: "rgba(255,255,255,.7)" },
  metaValue: { whiteSpace: "nowrap" },
  actionsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
};

export default s;