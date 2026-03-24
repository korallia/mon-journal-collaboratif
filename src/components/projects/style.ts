import type React from "react";

/* =========================
   Styles React (norme principale)
========================= */
export const projectStyles: Record<string, React.CSSProperties> = {
  /* ===== Headings ===== */
  projectTitle: {
    fontSize: "1.2rem",
    margin: "0 0 8px 0",
  },

  /* ===== Mobile ===== */
  projectMobileName: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },

  projectMetaGridTight: {
    marginTop: 6,
  },

  projectAccordionMobile: {
    marginTop: 12,
  },

  /* ===== Table ===== */
  projectTableHeadRow: {
    background: "#E5EAF1",
  },

  projectTableNameInput: {
    width: "100%",
  },

  projectTableName: {
    width: "100%",
    maxWidth: "180px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },

  projectTableTotal: {
    fontWeight: 600,
  },

  projectTableDatesCell: {
    textAlign: "left",
  },

  projectTableDatesStack: {
    alignItems: "flex-start",
  },

  projectOpenRowCell: {
    padding: "0 8px 10px 8px",
    background: "#3b4861ff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
};


