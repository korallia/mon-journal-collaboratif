/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import st from '../timeStyles';
import { EntryDTO } from '../types';
import { formatDate, formatHours } from '../utils';
import { useRouter } from 'next/navigation';


type Props = {
  entries: EntryDTO[];
  onEdit: (e: EntryDTO) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  hasProjects: boolean;
  projectLabel?: string; // ← NEW
  s: any;
};

export default function EntryList({
  entries,
  onEdit,
  onDelete,
  onRefresh,
  hasProjects,
  projectLabel,
  s,
}: Props)
 {
    const router = useRouter();
  return (
    <section style={st.card}>
      <div style={st.sectionHead}>
        <h3 style={st.cardTitle}>Dernières entrées</h3>
        <div style={s.topRight}>
        <button type="button" style={{...s.secondaryBtnOnDark}} onClick={() => router.push('/time/list')} disabled={!hasProjects}>
          Afficher la liste
        </button>
        <button type="button" style={s.ghostBtnOnDark} onClick={onRefresh} disabled={!hasProjects}>
          Rafraîchir
        </button>

        </div>
      </div>

      <ul style={st.entryList}>
        {entries.map((e) => (
          <li key={e.id} style={st.entryItem}>
  <div style={{ display: 'grid', gap: 4 }}>
    <div style={st.badgeRow}>
      {/* Projet (si fourni depuis la page) */}
      {projectLabel && (
        <span style={{ ...st.badgeBase, ...st.badgeProject }}>
          {projectLabel}
        </span>
      )}

      {/* Tâche */}
      <span style={{ ...st.badgeBase, ...st.badgeTask }}>
        {e.taskName ?? 'Tâche'}
      </span>

      {/* Durée */}
      <span style={{ ...st.badgeBase, ...st.badgeHours }}>
        {formatHours(e.hoursLogged)}
      </span>

      {/* Date */}
      <span style={{ ...st.badgeBase, ...st.badgeDate }}>
        {formatDate(e.entryDate)}
      </span>
    </div>

    {/* Titre + notes */}
    <div style={st.entryTitle}>
      {e.title || e.notes || '—'}
    </div>
  </div>

  <div style={st.itemActions}>
    <button style={s.ghostBtnOnDark} onClick={() => onEdit(e)}>
      Modifier
    </button>
    <button style={s.dangerBtn} onClick={() => onDelete(e.id)}>
      Supprimer
    </button>
  </div>
</li>
        ))}
        {entries.length === 0 && (
          <li style={s.muted}>{hasProjects ? 'Aucune entrée pour l’instant.' : '—'}</li>
        )}
      </ul>
    </section>
  );
}
