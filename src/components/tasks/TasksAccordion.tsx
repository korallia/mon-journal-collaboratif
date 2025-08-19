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
  const { success, error, promise } = useToast();
  const  confirm  = useConfirm();

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
      try {
        const r = await fetch(TASK_API.listByProject(projectId), { cache: 'no-store' });
        if (!r.ok) throw new Error('Impossible de charger les tâches');
        const data = (await r.json()) as TaskDTO[];
        setTasks(data);
      } catch (e: any) {
        setTasks([]);
        error(e?.message ?? 'Erreur de chargement des tâches');
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
        }).then((r) =>
          r.ok ? r.json() : Promise.reject(new Error('Création impossible')),
        ),
        { loading: 'Ajout…', success: 'Tâche ajoutée', error: 'Échec de l’ajout' },
      );

      setTasks((prev) => [created as TaskDTO, ...(prev ?? [])]);
      setNewTitle('');
    } catch {
      // toast déjà affiché par promise()
    }
  }

  async function updateTask(
    id: string,
    patch: Partial<Pick<TaskDTO, 'title' | 'done'>>,
    messages?: { loading?: string; success?: string; error?: string },
  ) {
    setSaving(true);
    try {
      const updated = await promise(
        fetch(TASK_API.byId(id), {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(patch),
        }).then((r) =>
          r.ok ? r.json() : Promise.reject(new Error('Mise à jour impossible')),
        ),
        {
          loading: messages?.loading ?? 'Enregistrement…',
          success: messages?.success ?? 'Tâche mise à jour',
          error: messages?.error ?? 'Échec de la mise à jour',
        },
      );

      setTasks((prev) => (prev ?? []).map((t) => (t.id === id ? (updated as TaskDTO) : t)));
      return updated as TaskDTO;
    } catch {
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function toggleDone(task: TaskDTO) {
    await updateTask(
      task.id,
      { done: !task.done },
      {
        loading: task.done ? 'Restauration…' : 'Finalisation…',
        success: task.done ? 'Repassée à faire' : 'Marquée terminée',
        error: 'Échec de la modification',
      },
    );
  }

  async function removeTask(task: TaskDTO) {
    const ok = await confirm({
      title: 'Supprimer cette tâche ?',
      description: 'Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      tone: 'danger',
    });
    if (!ok) return;

    try {
      await promise(
        fetch(TASK_API.byId(task.id), { method: 'DELETE' }).then((r) =>
          r.ok || r.status === 204
            ? true
            : Promise.reject(new Error('Suppression impossible')),
        ),
        { loading: 'Suppression…', success: 'Tâche supprimée', error: 'Échec de la suppression' },
      );

      setTasks((prev) => (prev ?? []).filter((t) => t.id !== task.id));
    } catch {
      // toast déjà géré par promise()
    }
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
    const updated = await updateTask(task.id, { title }, {
      loading: 'Enregistrement…',
      success: 'Titre mis à jour',
      error: 'Échec de la mise à jour',
    });
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
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask();
          }}
          style={s.input}
        />
        <button onClick={addTask} style={s.primaryBtn}>
          Ajouter
        </button>
      </div>

      <ul style={s.taskList}>
        {(tasks ?? []).map((t) => {
          const isEditing = editingId === t.id;

          return (
            <li key={t.id} style={s.taskItem}>
              {/* Contenu de la tâche (checkbox, titre, dates) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <label
                    style={{
                      ...s.taskLabel,
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
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
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
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
                    <button onClick={() => startEdit(t)} style={s.ghostBtnOnDark}>
                      Renommer
                    </button>
                    <button onClick={() => removeTask(t)} style={s.dangerBtn}>
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
        {tasks && tasks.length === 0 && <li style={s.muted}>Aucune tâche pour ce projet.</li>}
      </ul>
    </div>
  );
}
