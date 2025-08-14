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
  entryTitle: string; setEntryTitle: (v: string) => void;

  disabled: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;

  isEditing?: boolean;
  onCancelEdit?: () => void;

  s: any;
}

export default function EntryForm({
  tasks, taskId, setTaskId,
  entryDate, setEntryDate,
  hours, setHours,
  minutes, setMinutes,
  notes, setNotes,
  entryTitle, setEntryTitle,
  disabled, onSubmit, onReset,
  isEditing = false, onCancelEdit,
  s,
}: Props) {
  const hasTasks = tasks.length > 0;
  const canSubmit = !disabled && !!taskId && (hours > 0 || minutes > 0);

  return (
    <section style={{ ...st.card, ...(disabled ? { opacity: 0.7 } : null) }}>
      <h3 style={st.cardTitle}>{isEditing ? 'Modifier une entrée' : 'Ajouter une entrée'}</h3>

      {/* noValidate : évite que la validation native bloque le submit */}
      <form onSubmit={onSubmit} noValidate>
        {/* Ligne 1 : Tâche / Date / Heures / Minutes */}
        <div style={st.formRow}>
          {/* Tâche */}
          <div style={st.field}>
            <label htmlFor="ef-task" style={st.inputLabel}>Tâche</label>
            <select
              id="ef-task"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              disabled={disabled || !hasTasks}
              style={{ ...st.select, width: '100%', ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : null) }}
            >
              <option value="">{hasTasks ? 'Sélectionner une tâche…' : 'Aucune tâche'}</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div style={st.field}>
            <label htmlFor="ef-date" style={st.inputLabel}>Date</label>
            <input
              id="ef-date"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              disabled={disabled}
              style={{ ...st.input, width: '100%' }}
            />
          </div>

          {/* Heures */}
          <div style={st.field}>
            <label htmlFor="ef-hours" style={st.inputLabel}>Heures</label>
            <div style={st.unitWrap}>
              <input
                id="ef-hours"
                type="number"
                min={0}
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                disabled={disabled}
                style={{ ...st.input, width: '100%', paddingRight: 28 }}
                aria-describedby="ef-duration-help"
                inputMode="numeric"
              />
              <span style={st.unitBadge}>h</span>
            </div>
          </div>

          {/* Minutes */}
          <div style={st.field}>
            <label htmlFor="ef-minutes" style={st.inputLabel}>Minutes</label>
            <div style={st.unitWrap}>
              <input
                id="ef-minutes"
                type="number"
                min={0}
                max={59}
                step={1}
                placeholder="0"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                disabled={disabled}
                style={{ ...st.input, width: '100%', paddingRight: 34 }}
                aria-describedby="ef-duration-help"
                inputMode="numeric"
              />
              <span style={st.unitBadge}>min</span>
            </div>
          </div>
        </div>

        {/* Aide durée */}
        <div id="ef-duration-help" style={st.helpText}>
          La durée totale est calculée automatiquement. Les minutes sont limitées à 0–59.
        </div>

        {/* Titre plein largeur */}
        <div style={{ ...st.field, marginTop: 10, marginBottom: 10 }}>
          <label htmlFor="ef-title" style={st.inputLabel}>Titre de l’entrée</label>
          <input
            id="ef-title"
            type="text"
            placeholder="Ex. Réunion client ACME"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
            disabled={disabled}
            style={{ ...st.input, width: '100%' }}
          />
        </div>

        {/* Commentaire */}
        <textarea
          placeholder="Commentaire (optionnel)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={disabled}
          style={st.textarea}
        />
 {!canSubmit && (
  <div style={st.helpText}>Ajoute au moins 1 minute ou 1 heure pour enregistrer.</div>
)}
        {/* Actions */}
        <div style={st.actionsRow}>
          <button type="submit" disabled={!canSubmit} style={s.primaryBtn}>
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
          

          {isEditing ? (
            <button
              type="button"
              disabled={disabled}
              style={s.ghostBtnOnDark}
              onClick={onCancelEdit}
            >
              Annuler la modification
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled}
              style={s.ghostBtnOnDark}
              onClick={onReset}
            >
              Réinitialiser
            </button>
          )
          }
         
        </div>
      </form>
    </section>
  );
}
