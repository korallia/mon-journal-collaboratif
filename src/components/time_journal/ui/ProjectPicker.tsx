'use client';
import React from 'react';
import st from '../timeStyles';
import { ProjectDTO } from '../../types';

type Props = {
  projects: ProjectDTO[];
  projectId: string;
  setProjectId: (id: string) => void;
  disabled: boolean;
};

export default function ProjectPicker({ projects, projectId, setProjectId, disabled }: Props) {
  const hasProjects = projects.length > 0;
  const selectId = 'project-select';

  return (
    <div>
      {/* Titre au-dessus, comme "Nouveau projet" */}
      <label htmlFor={selectId} style={st.panelTitle}>Project Picker</label>

      {/* Champ sur toute la largeur */}
      <div style={st.pickerStack}>
        <select
          id={selectId}
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={disabled}
          style={{
            ...st.select,
            width: '100%', // ← plein largeur de la boîte
            ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : null),
          }}
        >
          {!hasProjects && <option value="">Aucun projet disponible</option>}
          {hasProjects &&
            projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
