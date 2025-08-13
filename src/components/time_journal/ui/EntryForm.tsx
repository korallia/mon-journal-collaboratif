'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import st from '../timeStyles';
import { TaskDTO } from '../types';

interface Props {
  tasks: TaskDTO[];
  taskId: string; setTaskId: (v: string) => void;
  entryDate: string; setEntryDate: (v: string) => void;
  hours: number; setHours: (v: number) => void;
  minutes: number; setMinutes: (v: number) => void;
  notes: string; setNotes: (v: string) => void;
  disabled: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  s: any;
}

export default function EntryForm({ tasks, taskId, setTaskId, entryDate, setEntryDate, hours, setHours, minutes, setMinutes, notes, setNotes, disabled, onSubmit, onReset, s, }: Props) {
  return (
    <section style={{ ...st.card, ...(disabled ? { opacity: 0.7 } : null) }}>
      <h3 style={st.cardTitle}>Ajouter une entrée</h3>
      <form onSubmit={onSubmit}>
        <div style={st.formRow}>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            disabled={disabled || tasks.length === 0}
            style={{ ...st.select, ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : null) }}
          >
            <option value="">{tasks.length ? 'Sélectionner une tâche…' : 'Aucune tâche'}</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} disabled={disabled} style={st.input} />
          <input type="number" min={0} placeholder="Heures" value={hours} onChange={(e) => setHours(Number(e.target.value))} disabled={disabled} style={st.input} />
          <input type="number" min={0} max={59} placeholder="Minutes" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} disabled={disabled} style={st.input} />
        </div>

        <textarea placeholder="Commentaire (optionnel)" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={disabled} style={st.textarea} />

        <div style={st.actionsRow}>
          <button type="submit" disabled={disabled || !taskId} style={s.primaryBtn}>Enregistrer</button>
          <button type="button" disabled={disabled} style={s.ghostBtnOnDark} onClick={onReset}>Réinitialiser</button>
        </div>
      </form>
    </section>
  );
}