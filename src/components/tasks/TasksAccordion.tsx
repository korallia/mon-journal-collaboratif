'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import s from '../dashboard/styles';
import { useToast } from '@/components/toast/ToastProvider';
import { useConfirm } from '@/components/confirm/ConfirmProvider';

const TASK_API = {
  listByProject: (projectId: string) => `/api/tasks?projectId=${projectId}`,
  create: `/api/tasks`,
  byId: (id: string) => `/api/tasks/${id}`,
};

export type TaskDTO = {
  id: string;
  projectId: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt?: string;
};

type Props = {
  projectId: string;
  isOpen: boolean;
};

export default function TasksAccordion({ projectId, isOpen }: Props) {
  const { error, promise } = useToast();
  const confirm = useConfirm();

  const [tasks, setTasks] = useState<TaskDTO[] | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || tasks !== null) return;
    (async () => {
      try {
        const r = await fetch(TASK_API.listByProject(projectId), { cache: 'no-store' });
        if (!r.ok) throw new Error('Impossible de charger les tâches');
        const data = (await r.json()) as TaskDTO[];
        setTasks(data);
      } catch (e: any) {
        setTasks([]);
        error(e?.message ?? 'Erreur de chargement');
      }
    })();
  }, [isOpen, projectId, tasks, error]);

  if (!isOpen) return null;

  async function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    try {
      const created = await promise(
        fetch(TASK_API.create, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ projectId, title }),
        }).then((r) => r.ok ? r.json() : Promise.reject(new Error('Erreur'))),
        { loading: 'Ajout…', success: 'Tâche ajoutée', error: 'Échec' }
      );
      setTasks((prev) => [created as TaskDTO, ...(prev ?? [])]);
      setNewTitle('');
    } catch { }
  }

  async function updateTask(id: string, patch: Partial<TaskDTO>) {
    setSaving(true);
    try {
      const updated = await promise(
        fetch(TASK_API.byId(id), {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(patch),
        }).then((r) => r.ok ? r.json() : Promise.reject(new Error('Erreur'))),
        { loading: 'Enregistrement…', success: 'Mis à jour', error: 'Échec' }
      );
      setTasks((prev) => (prev ?? []).map((t) => (t.id === id ? (updated as TaskDTO) : t)));
      return updated;
    } catch { return null; } finally { setSaving(false); }
  }

  const startEdit = (task: TaskDTO) => { setEditingId(task.id); setEditingTitle(task.title); };
  const cancelEdit = () => { setEditingId(null); setEditingTitle(''); };

  async function saveEdit(task: TaskDTO) {
    const title = editingTitle.trim();
    if (!title || title === task.title) { cancelEdit(); return; }
    if (await updateTask(task.id, { title })) cancelEdit();
  }

  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString() : '';

  return (
    <div style={s.accordionCell}>
      <div style={s.taskAddRow}>
        <input
          placeholder="Nouvelle tâche"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          style={s.input}
          className="dash-text-input"
        />
        <button onClick={addTask} style={s.primaryBtn}>Ajouter</button>
      </div>

      <ul style={s.taskList}>
        {(tasks ?? []).map((t) => {
          const isEditing = editingId === t.id;
          return (
            <li key={t.id} style={{ 
              ...s.taskItem, 
              display: 'flex', 
              flexDirection: 'row', 
              flexWrap: 'wrap', // Permet le passage en dessous sur mobile
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: 16 
            }}>
              
              {/* BLOC GAUCHE : Checkbox + Titre + Dates */}
              <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => updateTask(t.id, { done: !t.done })}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? saveEdit(t) : e.key === 'Escape' && cancelEdit()}
                        style={{ ...s.input, width: '100%' }}
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startEdit(t)}
                        style={{
                          textDecoration: t.done ? 'line-through' : 'none',
                          wordBreak: 'break-all', // Gère les longs textes sans espaces
                          display: 'block'
                        }}
                      >
                        {t.title}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ marginLeft: 28, marginTop: 4 }}>
                  <small style={s.muted}>Créée: {formatDate(t.createdAt)}</small>
                </div>
              </div>

              {/* BLOC DROITE : BOUTONS ACTIONS */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>
                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(t)} disabled={saving} style={s.primaryBtn}>
                      {saving ? '…' : 'OK'}
                    </button>
                    <button onClick={cancelEdit} style={s.ghostBtnOnDark}>Annuler</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(t)} style={s.ghostBtnOnDark}>Renommer</button>
                    <button onClick={async () => {
                      if (await confirm({ title: 'Supprimer ?', tone: 'danger' })) {
                        await fetch(TASK_API.byId(t.id), { method: 'DELETE' });
                        setTasks(prev => (prev ?? []).filter(item => item.id !== t.id));
                      }
                    }} style={s.dangerBtn}>Supprimer</button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}