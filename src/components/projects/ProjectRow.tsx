"use client";

import React from "react";
import s, { classes } from "../dashboard/styles";
import { projectStyles as projectS } from "../projects/style";
import type { ProjectDTO } from "./ProjectTable";
import type { TableMode } from "./ProjectTable";



type Props = {
  project: ProjectDTO;
  mode: TableMode;

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
  timeTotalLabel: string;
};

const ProjectRow: React.FC<Props> = ({
  project,
  mode,
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
           style={{ ...s.input, ...projectS.projectTableNameInput }}
          />
        ) : (
          project.name
        )}
      </td>

      {/* Dates */}
      {mode === "desktop" ? (
        <>
         <td style={s.projectCell}>{formatDateShort(project.createdAt)}</td>
          <td style={s.projectCell}>{formatDateShort(project.updatedAt)}</td>
        </>
      ) : (
        <td style={{ ...s.projectCell, ...projectS.projectTableDatesCell }}>
          <div style={{ ...s.metaStack, ...projectS.projectTableDatesStack }}>
           <span>
              C: {formatDateShort(project.createdAt)}
            </span>
            <span>
              M: {formatDateShort(project.updatedAt)}
            </span>
          </div>
        </td>
      )}

      {/* Temps total */}
      <td style={{ ...s.projectCell, ...projectS.projectTableTotal }}>
        {timeTotalLabel}
      </td>

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
              <button onClick={onSaveEdit} style={s.primaryBtn}>
                Enregistrer
              </button>
              <button onClick={onCancelEdit} style={s.ghostBtnOnDark}>
                Annuler
              </button>
            </>
          ) : (
            <>
              <button onClick={onBeginEdit} style={s.ghostBtnOnDark}>
                Modifier
              </button>
              <button onClick={onRemove} style={s.dangerBtn}>
                Supprimer
              </button>
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