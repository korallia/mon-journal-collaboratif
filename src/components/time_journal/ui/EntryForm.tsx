'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import st from '../timeStyles';
import { TaskDTO } from '../../types';

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
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const hasTasks = tasks.length > 0;
  const canSubmit = !disabled && !!taskId && (hours > 0 || minutes > 0);

  useEffect(() => {
    // Remonté à 650px : Switchera sur mobile vertical, restera desktop sur tablettes
    const checkSize = () => {
      setIsMobileLayout(window.innerWidth < 650);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Configuration du layout
  const dynamicFormRowStyle: React.CSSProperties = isMobileLayout 
    ? { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px 8px',
        width: '100%'
      } 
    : { 
        ...st.formRow, 
        // minmax(0, 1fr) est crucial pour permettre au select de rétrécir si besoin
        gridTemplateColumns: 'minmax(0, 1fr) 140px 85px 85px', 
        gap: '8px',
        alignItems: 'end'
      };

  return (
    <section style={{ ...st.card, ...(disabled ? { opacity: 0.7 } : null) }}>
      <h3 style={st.cardTitle}>{isEditing ? 'Modifier une entrée' : 'Ajouter une entrée'}</h3>

      <form onSubmit={onSubmit} noValidate>
        <div style={dynamicFormRowStyle}>
          
          {/* Tâche */}
          <div style={{ 
            ...st.field, 
            gridColumn: isMobileLayout ? '1 / span 2' : 'auto',
            minWidth: 0 
          }}>
            <label htmlFor="ef-task" style={st.inputLabel}>Tâche</label>
            <select
              id="ef-task"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              disabled={disabled || !hasTasks}
              style={{ 
                ...st.select, 
                width: '100%', 
                textOverflow: 'ellipsis',
                padding: '8px 4px',
                boxSizing: 'border-box' 
              }}
            >
              <option value="">{hasTasks ? 'Choisir tâche…' : 'Aucune'}</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div style={{ 
            ...st.field, 
            gridColumn: isMobileLayout ? '1 / span 2' : 'auto',
            gridRow: isMobileLayout ? '3' : 'auto'
          }}>
            <label htmlFor="ef-date" style={st.inputLabel}>Date</label>
            <input
              id="ef-date"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              disabled={disabled}
              style={{ ...st.input, width: '100%', padding: '8px 4px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Heures */}
          <div style={{ ...st.field, gridRow: isMobileLayout ? '2' : 'auto' }}>
            <label htmlFor="ef-hours" style={st.inputLabel}>Heures</label>
            <div style={st.unitWrap}>
              <input
                id="ef-hours"
                type="number"
                min={0}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                disabled={disabled}
                style={{ ...st.input, width: '100%', paddingRight: '22px', boxSizing: 'border-box' }}
                inputMode="numeric"
              />
              <span style={{ ...st.unitBadge, right: 6 }}>h</span>
            </div>
          </div>

          {/* Minutes */}
          <div style={{ ...st.field, gridRow: isMobileLayout ? '2' : 'auto' }}>
            <label htmlFor="ef-minutes" style={st.inputLabel}>Minutes</label>
            <div style={st.unitWrap}>
              <input
                id="ef-minutes"
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                disabled={disabled}
                style={{ ...st.input, width: '100%', paddingRight: '32px', boxSizing: 'border-box' }}
                inputMode="numeric"
              />
              <span style={{ ...st.unitBadge, right: 4, fontSize: '11px' }}>min</span>
            </div>
          </div>
        </div>

        {/* Titre */}
        <div style={{ ...st.field, marginTop: 16, marginBottom: 12 }}>
          <label htmlFor="ef-title" style={st.inputLabel}>Titre de l’entrée</label>
          <input
            id="ef-title"
            type="text"
            placeholder="Ex. Réunion client ACME"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
            disabled={disabled}
            style={{ ...st.input, width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* Commentaire */}
        <textarea
          placeholder="Commentaire (optionnel)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={disabled}
          style={{ ...st.textarea, boxSizing: 'border-box' }}
        />

        <div style={st.actionsRow}>
          <button type="submit" disabled={!canSubmit} style={s.primaryBtn}>
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
          
          <button
            type="button"
            disabled={disabled}
            style={s.ghostBtnOnDark}
            onClick={isEditing ? onCancelEdit : onReset}
          >
            {isEditing ? 'Annuler' : 'Réinitialiser'}
          </button>
        </div>
      </form>
    </section>
  );
}