"use client";

import React, { Fragment } from "react";
import s from "../dashboard/styles";
import ProjectRow from "./ProjectRow";
import TasksAccordion from "../tasks/TasksAccordion";

// Garde un type local pour éviter les imports circulaires
export type ProjectDTO = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt?: string | null;
};

type Props = {
  projects: ProjectDTO[];
  loading?: boolean;
  isNarrow: boolean;

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
  getRandomTime: () => string; // placeholder
};

const ProjectTable: React.FC<Props> = ({
  projects,
  loading,
  isNarrow,
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
      <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Mes projets</h2>
      <div style={s.tableScroll}>
        <table style={s.table}>
          <thead>
            <tr style={{ background: "#E5EAF1" }}>
              <th style={s.th}>Nom</th>
              <th style={{ ...s.th, width: 220 }}>Créé le</th>
              <th style={{ ...s.th, width: 220 }}>Modifié le</th>
              <th style={{ ...s.th, width: 140 }}>Temps total</th>
              <th style={{ ...s.th, width: isNarrow ? "280px" : "360px", textAlign: "center" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5}>
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
                          colSpan={5}
                          style={{
                            padding: "0 8px 10px 8px",
                            background: "#3b4861ff",
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16,
                          }}
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
