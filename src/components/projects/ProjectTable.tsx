"use client";

import React, { Fragment } from "react";
import s from "../dashboard/styles";
import ProjectRow from "./ProjectRow";
import TasksAccordion from "../tasks/TasksAccordion";
import { projectStyles as projectS } from "../projects/style";

// Garde un type local pour éviter les imports circulaires
export type ProjectDTO = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt?: string | null;
};

export type TableMode = "desktop" | "tablet" | "phone" ;

type Cols = {
  dateW: number;
  timeW: number;
  actionsW: number;
  mode: TableMode;
};

type Props = {
  projects: ProjectDTO[];
  loading?: boolean;
  isNarrow: boolean;
  mode: TableMode;
  cols: Cols;

  // édition
  editingId: string | null;
  editName: string;
  onEditNameChange: (v: string) => void;

  onBeginEdit: (p: ProjectDTO) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onRemove: (id: string) => void;

  openProjectId: string | null;
  onToggleOpen: (id: string) => void;

  // utils
  formatDateShort: (v?: string | null) => string;
  getRandomTime: () => string;
};

const ProjectTable: React.FC<Props> = ({
  projects,
  loading,
  isNarrow,
  mode,
  cols,
  editingId,
  editName,
  onEditNameChange,
  onBeginEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
  openProjectId,
  onToggleOpen,
  formatDateShort,
  getRandomTime,
}) => {
  return (
    <section style={s.card}>
      <h2 style={projectS.projectTitle}>Mes projets</h2>

      <div style={s.tableScroll}>
        <table style={s.table} className="dash-table">
          <colgroup>
            <col style={{ width: "auto" }} />
            {mode === "desktop" ? (
              <>
                <col style={{ width: cols.dateW }} />
                <col style={{ width: cols.dateW }} />
              </>
            ) : (
              <col style={{ width: cols.dateW }} />
            )}
            <col style={{ width: cols.timeW }} />
            <col style={{ width: cols.actionsW }} />
          </colgroup>

          <thead>
            <tr style={projectS.projectTableHeadRow}>
              {mode === "desktop" ? (
                <>
                  <th style={s.th}>Nom</th>
                  <th style={{ ...s.th, width: cols.dateW }}>Créé le</th>
                  <th style={{ ...s.th, width: cols.dateW }}>Modifié le</th>
                </>
              ) : (
                <>
                  <th style={{ ...s.th, width: cols.timeW }}>Nom</th>
                  <th style={{ ...s.th, width: cols.dateW }}>Dates</th>
                </>
              )}

              <th style={{ ...s.th, width: cols.timeW }}>Temps total</th>
              <th style={{ ...s.th, width: cols.actionsW, textAlign: "center" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={mode === "desktop" ? 5 : 4}>
                  <p style={{ ...s.muted, margin: "16px 0" }}>
                    {loading ? "Chargement…" : "Aucun projet pour l’instant."}
                  </p>
                </td>
              </tr>
            ) : (
              projects.map((p) => {
                const isEditing = editingId === p.id;
                const isOpen = openProjectId === p.id;

                return (
                  <Fragment key={p.id}>
                    <ProjectRow
                      project={p}
                      mode={mode}
                      isEditing={isEditing}
                      editName={isEditing ? editName : ""}
                      onEditNameChange={onEditNameChange}
                      onBeginEdit={() => onBeginEdit(p)}
                      onCancelEdit={onCancelEdit}
                      onSaveEdit={() => onSaveEdit(p.id)}
                      onRemove={() => onRemove(p.id)}
                      onToggleOpen={() => onToggleOpen(p.id)}
                      isOpen={isOpen}
                      isNarrow={isNarrow}
                      formatDateShort={formatDateShort}
                      timeTotalLabel={getRandomTime()}
                    />

                    {isOpen && (
                      <tr key={`${p.id}-tasks`}>
                        <td
                          colSpan={mode === "desktop" ? 5 : 4}
                          style={projectS.projectOpenRowCell}
                        >
                          <TasksAccordion projectId={p.id} isOpen={isOpen} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProjectTable;