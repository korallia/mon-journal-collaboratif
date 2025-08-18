'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import type { ProjectDTO, TaskDTO, EntryDTO } from '../types';

// ------------------- Endpoints -------------------
const API = {
  projectsByUser: (userId: string) => `/api/projects?userId=${encodeURIComponent(userId)}`,
  tasksByProject: (projectId: string) => `/api/tasks?projectId=${projectId}`,
  entries: {
    list: (limit = 20, projectId?: string) =>
      `/api/entries?limit=${limit}${projectId ? `&projectId=${projectId}` : ''}`,
    create: '/api/entries',
    byId: (id: string) => `/api/entries/${id}`,
  },
};

// ------------------- Utils -------------------
const todayISO = () => new Date().toISOString().slice(0, 10);
const toHours = (h: number, m: number) => {
  const hh = Number.isFinite(h) ? h : 0;
  const mm = Number.isFinite(m) ? m : 0;
  return hh + Math.max(0, Math.min(59, mm)) / 60;
};

// ------------------- Signature du hook -------------------
export interface UseTimeJournal {
  // sélections
  projects: ProjectDTO[];
  projectId: string;
  setProjectId: React.Dispatch<React.SetStateAction<string>>;
  tasks: TaskDTO[];
  taskId: string;
  setTaskId: React.Dispatch<React.SetStateAction<string>>;

  // formulaire
  entryDate: string; setEntryDate: (v: string) => void;
  hours: number; setHours: (v: number) => void;
  minutes: number; setMinutes: (v: number) => void;
  notes: string; setNotes: (v: string) => void;
  entryTitle: string; setEntryTitle: (v: string) => void;

  // entries
  entries: EntryDTO[];
  reloadEntries: (pid?: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** alias rétro-compat pour l’ancien nom */
  handleCreateEntry?: (e: React.FormEvent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (e: EntryDTO) => void;
  resetForm: () => void;
  cancelEdit: () => void;

  // state
  loadingProjects: boolean;
  noProjects: boolean;
  errorMsg: string;
  currentProject?: ProjectDTO;
  hasProjects: boolean;
  disabled: boolean;
  isEditing: boolean;
}

export function useTimeJournal(params: {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  userId?: string;
}): UseTimeJournal {
  const { status, userId } = params;

  // ------------------- Sélections -------------------
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [taskId, setTaskId] = useState<string>('');

  // ------------------- Formulaire -------------------
  const [entryDate, setEntryDate] = useState<string>(todayISO());
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [entryTitle, setEntryTitle] = useState<string>('');

  // ------------------- Entries -------------------
  const [entries, setEntries] = useState<EntryDTO[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ------------------- State divers -------------------
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [noProjects, setNoProjects] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // map id -> nom de tâche
  const taskNameById = useMemo(() => {
    const m = new Map<string, string>();
    tasks.forEach((t) => m.set(t.id, t.title));
    return m;
  }, [tasks]);

  // Auth: charger projets
  useEffect(() => {
    if (status !== 'authenticated' || !userId) return;
    (async () => {
      setLoadingProjects(true);
      setErrorMsg('');
      try {
        const r = await fetch(API.projectsByUser(userId), { cache: 'no-store' });
        if (!r.ok) throw new Error('Impossible de charger les projets.');
        const raw = (await r.json()) as any[];

        // normalise targetHours (Decimal -> number)
        const data: ProjectDTO[] = raw.map((p) => ({
          ...p,
          targetHours: p?.targetHours == null ? null : Number(p.targetHours),
        }));

        setProjects(data);
        if (data.length) {
          setProjectId((prev) => prev || data[0].id);
          setNoProjects(false);
        } else {
          setNoProjects(true);
        }
      } catch (e: any) {
        setErrorMsg(e?.message ?? 'Erreur de chargement des projets.');
        setNoProjects(true);
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, [status, userId]);

  // Changement de projet -> recharge tâches & entries
  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      setTaskId('');
      setEntries([]);
      return;
    }
    (async () => {
      const r = await fetch(API.tasksByProject(projectId), { cache: 'no-store' });
      const data: TaskDTO[] = (await r.json()) || [];
      setTasks(data);
      // Toujours forcer une sélection valide si possible
      setTaskId((prev) => data.find((t) => t.id === prev)?.id ?? data[0]?.id ?? '');
    })();
    reloadEntries(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const currentProject = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId]
  );

  const hasProjects = projects.length > 0;
  const disabled = !hasProjects || loadingProjects || status !== 'authenticated';

  function reloadEntries(pid?: string) {
    if (!pid) { setEntries([]); return; }
    (async () => {
      const r = await fetch(API.entries.list(20, pid), { cache: 'no-store' });
      const data: EntryDTO[] = (await r.json()) || [];
      const enriched = data.map((e) => ({
        ...e,
        taskName: e.taskName || taskNameById.get(e.taskId) || 'Tâche',
      }));
      setEntries(enriched);
    })();
  }

  function resetForm() {
    setTaskId(tasks[0]?.id ?? '');
    setEntryDate(todayISO());
    setHours(0);
    setMinutes(0);
    setNotes('');
    setEntryTitle('');
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  console.debug('[handleSubmit] projectId:', projectId, 'taskId:', taskId);
  if (!projectId || !taskId) return;

  const totalHours = toHours(hours, minutes);
  console.debug('[handleSubmit] totalHours:', totalHours);
  if (totalHours <= 0) return;

  const payload = {
    entryDate,
    hoursLogged: totalHours,
    notes: notes?.trim() || undefined,
    title: entryTitle?.trim() || undefined,
  };

  if (editingId) {
    console.debug('[PATCH] /api/entries/' + editingId, payload);
    const r = await fetch(API.entries.byId(editingId), {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      // lis le message d'erreur si dispo
      let msg = '';
      try { msg = (await r.json())?.error ?? ''; } catch {}
      console.error('[PATCH failed]', r.status, msg);

      // Si 404 -> l’entrée n’existe plus (supprimée ailleurs) : on nettoie la liste et on quitte le mode édition
      if (r.status === 404) {
        setEntries(prev => prev.filter(e => e.id !== editingId));
        setEditingId(null);
        resetForm();
      } else {
        alert('Échec de la modification: ' + (msg || r.status));
      }
      return;
    }

    const updated: EntryDTO = await r.json();
    updated.taskName = updated.taskName || taskNameById.get(updated.taskId) || 'Tâche';
    setEntries(prev => prev.map(it => (it.id === updated.id ? updated : it)));
    setEditingId(null);
    resetForm();
    return;
  }

  // ----- POST (créer)
  console.debug('[POST] /api/entries', { ...payload, taskId });
  const r = await fetch(API.entries.create, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...payload, taskId }),
  });

  if (!r.ok) {
    let msg = '';
    try { msg = (await r.json())?.error ?? ''; } catch {}
    console.error('[POST failed]', r.status, msg);
    alert('Échec de la création: ' + (msg || r.status));
    return;
  }

  const created: EntryDTO = await r.json();
  created.taskName = created.taskName || taskNameById.get(created.taskId) || 'Tâche';
  setEntries(prev => [created, ...prev]);
  resetForm();
}


  async function onDelete(id: string) {
    const ok = window.confirm('Supprimer cette entrée ?');
    if (!ok) return;
    const r = await fetch(API.entries.byId(id), { method: 'DELETE' });
    if (r.ok || r.status === 204) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setEditingId((old) => (old === id ? null : old));
    }
  }

  function onEdit(entry: EntryDTO) {
    setEditingId(entry.id);
    setTaskId(entry.taskId);
    setEntryDate(entry.entryDate.slice(0, 10));
    const h = Math.floor(entry.hoursLogged);
    const m = Math.round((entry.hoursLogged - h) * 60);
    setHours(h);
    setMinutes(m);
    setNotes(entry.notes || '');
    setEntryTitle(entry.title || '');
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
  }

  return {
    // sélections
    projects, projectId, setProjectId,
    tasks, taskId, setTaskId,

    // formulaire
    entryDate, setEntryDate,
    hours, setHours,
    minutes, setMinutes,
    notes, setNotes,
    entryTitle, setEntryTitle,

    // entries
    entries,
    reloadEntries,
    handleSubmit,
    handleCreateEntry: handleSubmit, // alias rétro-compat
    onDelete,
    onEdit,
    resetForm,
    cancelEdit,

    // state
    loadingProjects,
    noProjects,
    errorMsg,
    currentProject,
    hasProjects,
    disabled,
    isEditing: !!editingId,
  };
}
