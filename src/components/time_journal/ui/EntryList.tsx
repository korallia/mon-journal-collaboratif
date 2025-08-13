'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import st from '../timeStyles';
import { EntryDTO } from '../types';
import { formatDate, formatHours } from '../utils';

type Props = {
  entries: EntryDTO[];
  onEdit: (e: EntryDTO) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  hasProjects: boolean;
  s: any; // style-kit global (boutons, muted, danger, etc.)
};

export default function EntryList({
  entries,
  onEdit,
  onDelete,
  onRefresh,
  hasProjects,
  s,
}: Props) {
  return (
    <section style={st.card}>
      <div style={st.sectionHead}>
        <h3 style={st.cardTitle}>Dernières entrées</h3>
        <button
          type="button"
          style={s.ghostBtnOnDark}
          onClick={onRefresh}
          disabled={!hasProjects}
        >
          Rafraîchir
        </button>
      </div>

      <ul style={st.entryList}>
        {entries.map((e) => (
          <li key={e.id} style={st.entryItem}>
            <div>
              {/* Ligne titre */}
              <div style={st.entryTitle}>
                <span style={st.badge}>{e.taskName || 'Tâche'}</span>
                <span style={{ fontWeight: 700 }}>
                  {e.title ? e.title : e.notes ? e.notes : '—'}
                </span>
              </div>

              {/* Afficher la note quand il y a aussi un titre */}
              {e.title && e.notes && (
                <div style={{ marginTop: 2 }}>{e.notes}</div>
              )}

              {/* Métadonnées */}
              <div style={st.entryMeta}>
                {formatDate(e.entryDate)} • {formatHours(e.hoursLogged)}
              </div>
            </div>

            <div style={st.itemActions}>
              <button type="button" style={s.ghostBtnOnDark} onClick={() => onEdit(e)}>
                Modifier
              </button>
              <button
                type="button"
                style={s.dangerBtn}
                onClick={() => onDelete(e.id)}
                aria-label="Supprimer l’entrée"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}

        {entries.length === 0 && (
          <li style={s.muted}>
            {hasProjects ? 'Aucune entrée pour l’instant.' : '—'}
          </li>
        )}
      </ul>
    </section>
  );
}
