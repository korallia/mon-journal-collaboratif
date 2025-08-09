import type React from "react";

export const s: Record<string, React.CSSProperties> = {
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
  muted: { color: "#6b7280" },
  alert: {
    background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A",
    padding: 12, borderRadius: 8, marginBottom: 16,
  },

  // Cards
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 16 },

  // Controls
  row: { display: "flex", gap: 8, alignItems: "center" },
  input: { flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db", outline: "none" },

  // Table
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" },
  th: { textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontWeight: 600 },

  // Dark row with rounded corners
  tdOnDark: {
    background: "#1E293B", color: "#FFFFFF", padding: "10px 8px", border: "none",
  },
  tdOnDarkFirst: {
    background: "#1E293B", color: "#FFFFFF", padding: "10px 8px", border: "none",
    borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
  },
  tdOnDarkLast: {
    background: "#1E293B", color: "#FFFFFF", padding: "10px 8px", border: "none",
    borderTopRightRadius: 16, borderBottomRightRadius: 16,
  },

  // Buttons
  primaryBtn: { padding: "8px 12px", borderRadius: 8, border: "1px solid", background: "#4CAF50", color: "#FFFFFF", cursor: "pointer", marginLeft: 4 },
  dangerBtn:  { padding: "8px 12px", borderRadius: 8, border: "1px solid #ef4444", background: "#ef4444", color: "#fff", cursor: "pointer", marginLeft: 4 },
  ghostBtn:   { padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#111827", cursor: "pointer", marginLeft: 4 },
  ghostBtnOnDark: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.35)",
    background: "transparent", backgroundColor: "#4B5563", color: "#FFFFFF", cursor: "pointer", marginLeft: 4,
  },
  secondaryBtnOnDark: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.2)",
    background: "#334155", color: "#FFFFFF", cursor: "pointer", marginLeft: 4,
  },
  outBtnOnDark: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.35)",
    background: "transparent", color: "#fff", cursor: "pointer",
  },

  // Accordion
  accordionCell: { background: "#0b1220", borderRadius: 12, padding: 14, color: "#e5e7eb" },
  taskAddRow: { display: "flex", gap: 8, marginBottom: 10 },
  taskList: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 },
  taskItem: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#111827", border: "1px solid #1f2937", borderRadius: 10, padding: "8px 10px" },
  taskLabel: { display: "flex", alignItems: "center", gap: 8 },
};
export default s;
