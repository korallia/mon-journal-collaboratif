"use client";

import React from "react";
import s, { classes } from "../dashboard/styles";
import type { ProjectDTO } from "./ProjectTable";

type Props = {
  project: ProjectDTO;

  // état d’édition pour CETTE ligne
  isEditing: boolean;
  editName: string;
  onEditNameChange: (v: string) => void;

  // callbacks
  onBeginEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRemove: () => void;
  onToggleOpen: () => void;

  // état UI
  isOpen: boolean;
  isNarrow: boolean;

  // utils
  formatDateShort: (v?: string | null) => string;
  timeTotalLabel: string; // placeholder
};

const ProjectRow: React.FC<Props> = ({
  project,
  isEditing,
  editName,
  onEditNameChange,
  onBeginEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
  onToggleOpen,
  isOpen,
  isNarrow,
  formatDateShort,
  timeTotalLabel,
}) => {
  return (
    <tr style={s.projectRow}>
      {/* Nom */}
      <td style={{ ...s.projectCell, ...s.projectCellFirst }}>
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className={classes.textInput}
            style={s.input}
          />
        ) : (
          project.name
        )}
      </td>

      {/* Créé le */}
      <td
        style={{
          ...s.projectCell,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 220,
        }}
      >
        {formatDateShort(project.createdAt)}
      </td>

      {/* Modifié le */}
      <td
        style={{
          ...s.projectCell,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 220,
        }}
      >
        {formatDateShort(project.updatedAt)}
      </td>

      {/* Temps total (placeholder) */}
      <td style={{ ...s.projectCell, fontWeight: 600 }}>{timeTotalLabel}</td>

      {/* Actions */}
      <td style={{ ...s.projectCell, ...s.projectCellLast }}>
        <div
          style={{
            ...s.projectActions,
            flexWrap: isNarrow ? "wrap" : "nowrap",
            rowGap: 8,
            alignItems: "center",
            minWidth: isNarrow ? 0 : 320,
          }}
        >
          {isEditing ? (
            <>
              <button onClick={onSaveEdit} style={s.primaryBtn}>Enregistrer</button>
              <button onClick={onCancelEdit} style={s.ghostBtnOnDark}>Annuler</button>
            </>
          ) : (
            <>
              <button onClick={onBeginEdit} style={s.ghostBtnOnDark}>Modifier</button>
              <button onClick={onRemove} style={s.dangerBtn}>Supprimer</button>
              <button onClick={onToggleOpen} style={s.secondaryBtnOnDark}>
                {isOpen ? "Fermer tâches" : "Tâches"}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ProjectRow;
