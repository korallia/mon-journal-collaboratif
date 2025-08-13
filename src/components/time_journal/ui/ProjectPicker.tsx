'use client';
import React from 'react';
import st from '../timeStyles';
import { ProjectDTO } from '../types';

type Props = {
  projects: ProjectDTO[];
  projectId: string;
  setProjectId: (id: string) => void;
  disabled: boolean;
};

export default function ProjectPicker({ projects, projectId, setProjectId, disabled }: Props) {
  const hasProjects = projects.length > 0;
  return (
    <div style={st.projectPicker}>
      <label style={st.pickerLabel}>Projet</label>
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        disabled={disabled}
        style={{ ...st.select, ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : null) }}
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
  );
}