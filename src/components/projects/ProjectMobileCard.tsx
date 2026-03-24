"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import s, { classes } from "../dashboard/styles";
import TasksAccordion from "../tasks/TasksAccordion";
import { projectStyles as projectS } from "../projects/style";
import type { ProjectDTO } from "./ProjectTable";

type Props = {
  project: ProjectDTO;

  // état
  isEditing: boolean;
  isOpen: boolean;

  // édition
  editName: string;
  onEditNameChange: (v: string) => void;

  // actions
  onBeginEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRemove: () => void;
  onToggleOpen: () => void;

  // utils
  formatDateShort: (v?: string | null) => string;
  timeTotalLabel: string;
};

const ProjectMobileCard: React.FC<Props> = ({
  project,
  isEditing,
  isOpen,
  editName,
  onEditNameChange,
  onBeginEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
  onToggleOpen,
  formatDateShort,
  timeTotalLabel,
}) => {
  return (
    <li style={s.projectCard}>
      {/* Nom */}
      <div style={s.projectName}>
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className={classes.textInput}
            style={s.input}
          />
        ) : (
          <span style={projectS.projectMobileName}>
            {project.name}
          </span>
        )}
      </div>

      {/* Dates */}
      <div style={s.metaGrid}>
        <div>
          <div style={s.metaLabel}>Créé le</div>
          <div style={s.metaValue}>{formatDateShort(project.createdAt)}</div>
        </div>
        <div>
          <div style={s.metaLabel}>Modifié le</div>
          <div style={s.metaValue}>{formatDateShort(project.updatedAt)}</div>
        </div>
      </div>

      {/* Temps total */}
      <div style={{ ...s.metaGrid, ...projectS.projectMetaGridTight }}>
        <div>
          <div style={s.metaLabel}>Temps total</div>
          <div style={s.metaValue}>{timeTotalLabel}</div>
        </div>
      </div>

      {/* Actions */}
      <div style={s.actionsRow}>
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

      {/* Accordion */}
      {isOpen && (
        <div style={{ ...s.accordionCell, ...projectS.projectAccordionMobile }}>
          <TasksAccordion projectId={project.id} isOpen={isOpen} />
        </div>
      )}
    </li>
  );
};

export default ProjectMobileCard;