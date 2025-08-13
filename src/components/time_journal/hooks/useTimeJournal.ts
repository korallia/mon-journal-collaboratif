'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import API from '../api';
import { EntryDTO, ProjectDTO, TaskDTO } from '../types';
import { todayISO, toHours } from '../utils';

// (facultatif mais propre) type de retour explicite
export interface UseTimeJournal {
  // selections
  projects: ProjectDTO[];
  projectId: string;
  setProjectId: React.Dispatch<React.SetStateAction<string>>;
  tasks: TaskDTO[];
  taskId: string;
  setTaskId: React.Dispatch<React.SetStateAction<string>>;
  // form
  entryDate: string; setEntryDate: (v: string) => void;
  hours: number; setHours: (v: number) => void;
  minutes: number; setMinutes: (v: number) => void;
  notes: string; setNotes: (v: string) => void;
  entryTitle: string; setEntryTitle: (v: string) => void;   // ← NEW
  // entries
  entries: EntryDTO[];
  reloadEntries: (pid?: string) => void;
  handleCreateEntry: (e: React.FormEvent) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (e: EntryDTO) => void;
  resetForm: () => void;
  // state
  loadingProjects: boolean;
  noProjects: boolean;
  errorMsg: string;
  currentProject?: ProjectDTO;
  hasProjects: boolean;
  disabled: boolean;
}

export function useTimeJournal(
  params: { status: 'loading'|'authenticated'|'unauthenticated'; userId?: string }
): UseTimeJournal {
  const { status, userId } = params;

  // selections
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [taskId, setTaskId] = useState<string>('');

  // form
  const [entryDate, setEntryDate] = useState<string>(todayISO());
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [entryTitle, setEntryTitle] = useState<string>('');         // ← NEW

  // entries
  const [entries, setEntries] = useState<EntryDTO[]>([]);

  // state
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [noProjects, setNoProjects] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const taskNameById = useMemo(() => {
    const m = new Map<string, string>();
    tasks.forEach((t) => m.set(t.id, t.title));
    return m;
  }, [tasks]);

  // fetch projects WHEN we have a userId
  useEffect(() => {
    if (status !== 'authenticated' || !userId) return;

    (async () => {
      setLoadingProjects(true);
      setErrorMsg('');
      try {
        const r = await fetch(API.projectsByUser(userId), { cache: 'no-store' });
        if (!r.ok) throw new Error('Impossible de charger les projets.');
        const data = (await r.json()) as ProjectDTO[];
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

  // load tasks + entries when project changes
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
      if (!data.find((t) => t.id === taskId)) {
        setTaskId(data[0]?.id ?? '');
      }
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
    (async () => {
      const r = await fetch(API.entries.list(20, pid || undefined), { cache: 'no-store' });
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
    setEntryTitle('');                              // ← NEW
  }

  async function handleCreateEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !taskId) return;

    const totalHours = toHours(hours, minutes);
    if (totalHours <= 0) return;

    const payload = {
      taskId,
      entryDate,
      hoursLogged: totalHours,
      notes: notes?.trim() || undefined,
      title: entryTitle?.trim() || undefined,       // ← NEW
    };

    const r = await fetch(API.entries.create, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return;

    const created: EntryDTO = await r.json();
    created.taskName = taskNameById.get(created.taskId) || 'Tâche';
    if (!created.title) created.title = entryTitle || ''; // fallback local
    setEntries((prev) => [created, ...prev]);
    resetForm();
  }

  async function onDelete(id: string) {
    const ok = window.confirm('Supprimer cette entrée ?');
    if (!ok) return;
    const r = await fetch(API.entries.byId(id), { method: 'DELETE' });
    if (r.ok || r.status === 204) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  }

  function onEdit(entry: EntryDTO) {
    setTaskId(entry.taskId);
    setEntryDate(entry.entryDate.slice(0, 10));
    const h = Math.floor(entry.hoursLogged);
    const m = Math.round((entry.hoursLogged - h) * 60);
    setHours(h);
    setMinutes(m);
    setNotes(entry.notes || '');
    setEntryTitle(entry.title || '');               // ← NEW
  }

  return {
    // selections
    projects, projectId, setProjectId,
    tasks, taskId, setTaskId,
    // form
    entryDate, setEntryDate, hours, setHours, minutes, setMinutes, notes, setNotes,
    entryTitle, setEntryTitle,                          // ← NEW
    // entries
    entries, reloadEntries, handleCreateEntry, onDelete, onEdit, resetForm,
    // state
    loadingProjects, noProjects, errorMsg, currentProject, hasProjects, disabled,
  };
}
