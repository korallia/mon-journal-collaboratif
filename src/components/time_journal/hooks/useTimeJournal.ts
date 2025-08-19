'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import type { ProjectDTO, TaskDTO, EntryDTO } from '../types';
import { useToast } from '@/components/toast/ToastProvider';
import { useConfirm } from '@/components/confirm/ConfirmProvider';

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

  const { success, error, promise } = useToast();
  const  confirm  = useConfirm();

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
        error(e?.message ?? 'Erreur de chargement des projets.');
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, [status, userId, error]);

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
        taskName: (e as any).taskName || taskNameById.get(e.taskId) || 'Tâche',
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

    if (!projectId) {
      error('Aucun projet sélectionné.');
      return;
    }
    if (!taskId) {
      error('Choisis une tâche.');
      return;
    }

    const totalHours = toHours(hours, minutes);
    if (totalHours <= 0) {
      error('Ajoute au moins 1 minute ou 1 heure.');
      return;
    }

    const payload = {
      entryDate,
      hoursLogged: totalHours,
      notes: notes?.trim() || undefined,
      title: entryTitle?.trim() || undefined,
    };

    // ----- PATCH (éditer)
    if (editingId) {
      try {
        const updated = await promise(
          fetch(API.entries.byId(editingId), {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          }).then(async (r) => {
            if (r.ok) return (await r.json()) as EntryDTO;
            if (r.status === 404) {
              const err: any = new Error('Entrée introuvable');
              err.code = 'NOT_FOUND';
              throw err;
            }
            let msg = '';
            try { msg = (await r.json())?.error ?? ''; } catch {}
            throw new Error(msg || 'Mise à jour impossible');
          }),
          { loading: 'Mise à jour…', success: 'Entrée mise à jour', error: 'Échec de la mise à jour' }
        );

        (updated as any).taskName =
          (updated as any).taskName || taskNameById.get(updated.taskId) || 'Tâche';

        setEntries((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
        setEditingId(null);
        resetForm();
      } catch (e: any) {
        if (e?.code === 'NOT_FOUND') {
          // Nettoie la liste et quitte le mode édition
          setEntries((prev) => prev.filter((x) => x.id !== editingId));
          setEditingId(null);
          resetForm();
        }
      }
      return;
    }

    // ----- POST (créer)
    try {
      const created = await promise(
        fetch(API.entries.create, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...payload, taskId }),
        }).then(async (r) => {
          if (r.ok) return (await r.json()) as EntryDTO;
          let msg = '';
          try { msg = (await r.json())?.error ?? ''; } catch {}
          throw new Error(msg || 'Création impossible');
        }),
        { loading: 'Enregistrement…', success: 'Entrée ajoutée', error: 'Échec de l’enregistrement' }
      );

      (created as any).taskName =
        (created as any).taskName || taskNameById.get(created.taskId) || 'Tâche';

      setEntries((prev) => [created, ...prev]);
      resetForm();
    } catch {
      // les toasts sont déjà gérés par promise()
    }
  }

  async function onDelete(id: string) {
    const ok = await confirm({
      title: 'Supprimer cette entrée ?',
      description: 'Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      tone: 'danger',
    });
    if (!ok) return;

    try {
      await promise(
        fetch(API.entries.byId(id), { method: 'DELETE' }).then((r) =>
          r.ok || r.status === 204 ? true : Promise.reject(new Error('Suppression impossible'))
        ),
        { loading: 'Suppression…', success: 'Entrée supprimée', error: 'Échec de la suppression' }
      );
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setEditingId((old) => (old === id ? null : old));
    } catch {
      // toast déjà géré
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
    success('Mode édition activé'); // petit feedback sympa
  }

  function cancelEdit() {
    setEditingId(null);
    resetForm();
    success('Modification annulée');
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
