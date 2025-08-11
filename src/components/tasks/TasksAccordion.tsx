'use client';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useEffect, useState } from 'react';
import s from '../dashboard/styles';

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
  const [tasks, setTasks] = useState<TaskDTO[] | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Édition inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [saving, setSaving] = useState(false);

  // lazy-load à l'ouverture
  useEffect(() => {
    if (!isOpen || tasks !== null) return;
    (async () => {
      const r = await fetch(TASK_API.listByProject(projectId));
      if (!r.ok) return setTasks([]);
      const data = (await r.json()) as TaskDTO[];
      setTasks(data);
    })();
  }, [isOpen, projectId, tasks]);

  if (!isOpen) return null;

  async function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    const r = await fetch(TASK_API.create, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId, title }),
    });
    if (!r.ok) return;
    const created = (await r.json()) as TaskDTO;
    setTasks(prev => [created, ...(prev ?? [])]);
    setNewTitle('');
  }

  async function updateTask(id: string, patch: Partial<Pick<TaskDTO, 'title' | 'done'>>) {
    setSaving(true);
    try {
      const r = await fetch(TASK_API.byId(id), {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!r.ok) return null;
      const updated = (await r.json()) as TaskDTO;
      setTasks(prev => (prev ?? []).map(t => (t.id === id ? updated : t)));
      return updated;
    } finally {
      setSaving(false);
    }
  }

  async function toggleDone(task: TaskDTO) {
    await updateTask(task.id, { done: !task.done });
  }

  async function removeTask(task: TaskDTO) {
    const ok = window.confirm('Supprimer cette tâche ?');
    if (!ok) return;
    const r = await fetch(TASK_API.byId(task.id), { method: 'DELETE' });
    if (!r.ok && r.status !== 204) return;
    setTasks(prev => (prev ?? []).filter(t => t.id !== task.id));
  }

  function startEdit(task: TaskDTO) {
    setEditingId(task.id);
    setEditingTitle(task.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle('');
  }

  async function saveEdit(task: TaskDTO) {
    const title = editingTitle.trim();
    if (!title || title === task.title) {
      cancelEdit();
      return;
    }
    const updated = await updateTask(task.id, { title });
    if (updated) cancelEdit();
  }

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : '';

  return (
    <div style={s.accordionCell}>
      <div style={s.taskAddRow}>
        <input
          placeholder="Nouvelle tâche"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') addTask();
          }}
          style={s.input}
        />
        <button onClick={addTask} style={s.primaryBtn}>
          Ajouter
        </button>
      </div>

      <ul style={s.taskList}>
        {(tasks ?? []).map(t => {
          const isEditing = editingId === t.id;

          return (
            <li key={t.id} style={s.taskItem}>
              {/* Contenu de la tâche (checkbox, titre, dates) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label style={{ ...s.taskLabel, margin: 0, display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleDone(t)}
                      disabled={saving && isEditing}
                      style={{ marginRight: 8 }}
                    />
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEdit(t);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        style={{ ...s.input, padding: '6px 8px', width: 260 }}
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startEdit(t)}
                        title="Double-clic pour renommer"
                        style={{
                          textDecoration: t.done ? 'line-through' : 'none',
                          cursor: 'text',
                        }}
                      >
                        {t.title}
                      </span>
                    )}
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 30 }}>
                  <small style={s.muted}>Créée: {formatDate(t.createdAt)}</small>
                  {t.updatedAt && (
                    <small style={s.muted}>Modifiée: {formatDate(t.updatedAt)}</small>
                  )}
                </div>
              </div>

              {/* Conteneur droite pour les actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(t)} disabled={saving} style={s.primaryBtn}>
                      {saving ? '…' : 'Enregistrer'}
                    </button>
                    <button onClick={cancelEdit} style={s.ghostBtnOnDark}>
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(t)} style={s.ghostBtnOnDark}>Renommer</button>
                    <button onClick={() => removeTask(t)} style={s.dangerBtn}>Supprimer</button>
                  </>
                )}
              </div>
            </li>
          );
        })}
        {tasks && tasks.length === 0 && (
          <li style={s.muted}>Aucune tâche pour ce projet.</li>
        )}
      </ul>
    </div>
  );
}