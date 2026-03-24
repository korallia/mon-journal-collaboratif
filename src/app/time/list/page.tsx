'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Styles + types (avec alias @). Adapte en relatif si besoin.
import s from '@/components/dashboard/styles';
import st from '@/components/time_journal/timeStyles';
import type { ProjectDTO, TaskDTO, EntryDTO } from '@/components/types';

// --- API endpoints (meme shape que la page time) ---
const API = {
  projectsByUser: (userId: string) => `/api/projects?userId=${encodeURIComponent(userId)}`,
  tasksByProject: (projectId: string) => `/api/tasks?projectId=${projectId}`,
  entries: {
    list: (limit = 500, projectId?: string) =>
      `/api/entries?limit=${limit}${projectId ? `&projectId=${projectId}` : ''}`,
  },
};

// --- Helpers d'affichage ---
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
function formatHours(h: number) {
  const whole = Math.floor(h);
  const min = Math.round((h - whole) * 60);
  return min ? `${whole} h ${min} min` : `${whole} h`;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  // Sélections
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [taskId, setTaskId] = useState<string>('');

  // Filtres
  const [dateFrom, setDateFrom] = useState<string>(''); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState<string>('');     // yyyy-mm-dd

  // Données
  const [entries, setEntries] = useState<EntryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Redirection si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  // Charger les projets
  useEffect(() => {
    if (status !== 'authenticated' || !userId) return;
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const r = await fetch(API.projectsByUser(userId), { cache: 'no-store' });
        if (!r.ok) throw new Error('Impossible de charger les projets.');
        const raw = (await r.json()) as any[];
        const data: ProjectDTO[] = raw.map((p) => ({
          ...p,
          targetHours: p?.targetHours == null ? null : Number(p.targetHours),
        }));
        setProjects(data);
        if (data.length) setProjectId((prev) => prev || data[0].id);
      } catch (e: any) {
        setErrorMsg(e?.message ?? 'Erreur de chargement des projets.');
      } finally {
        setLoading(false);
      }
    })();
  }, [status, userId]);

  // Charger tâches + entrées quand le projet change
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
      if (!data.find((t) => t.id === taskId)) setTaskId('');
    })();
    reloadEntries(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function reloadEntries(pid?: string) {
    if (!pid) { setEntries([]); return; }
    setLoading(true);
    try {
      const r = await fetch(API.entries.list(500, pid), { cache: 'no-store' });
      const data: EntryDTO[] = (await r.json()) || [];
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }

  const currentProject = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId]
  );

  // Filtrage client par tâche et plage de dates
  const filteredEntries = useMemo(() => {
    const fromT = dateFrom ? Date.parse(dateFrom) : null;
    const toT = dateTo ? Date.parse(dateTo) : null;

    return entries.filter((e) => {
      if (taskId && e.taskId !== taskId) return false;
      if (fromT || toT) {
        const t = Date.parse(e.entryDate.slice(0, 10));
        if (fromT && t < fromT) return false;
        if (toT && t > toT) return false;
      }
      return true;
    });
  }, [entries, taskId, dateFrom, dateTo]);

  const hasProjects = projects.length > 0;
  const disabledFilters = !hasProjects || status !== 'authenticated' || loading;

  return (
    <div style={st.container}>
      {/* Header */}
      <div style={st.hero}>
        <div style={st.heroRow}>
          <div style={st.heroLeft}>
            <div style={st.avatar}>📋</div>
            <div>
              <h1 style={st.heroTitle}>Toutes les entrees</h1>
              <div style={st.heroSub}>
                {loading
                  ? 'Chargement...'
                  : currentProject
                    ? `Projet : ${currentProject.name}`
                    : 'Selectionnez un projet pour afficher les entrees'}
                {errorMsg ? (
                  <span style={{ marginLeft: 8, color: '#FCA5A5' }}>{errorMsg}</span>
                ) : null}
              </div>
            </div>
          </div>
          <div style={st.heroRight}>
            <a href="/dashboard" style={s.primaryBtn}>Dashboard</a>
            <a href="/time/new" style={s.ghostBtnOnDark}>Journal de temps</a>
          </div>
        </div>
      </div>

      {/* Panneau de filtres */}
      <div style={st.panelLight}>
        {/* Projet */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, marginBottom: 8 }}>
          <label style={st.pickerLabel}>Projet</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={disabledFilters}
            style={{ ...st.select, ...(disabledFilters ? { opacity: 0.6, cursor: 'not-allowed' } : null) }}
          >
            {!hasProjects && <option value="">Aucun projet</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Tâche + dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px', gap: 8 }}>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            disabled={disabledFilters || tasks.length === 0}
            style={{ ...st.select, ...(disabledFilters ? { opacity: 0.6, cursor: 'not-allowed' } : null) }}
          >
            <option value="">{tasks.length ? 'Toutes les taches' : 'Aucune tache'}</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            disabled={disabledFilters}
            style={st.input}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            disabled={disabledFilters}
            style={st.input}
          />
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => reloadEntries(projectId)}
            disabled={!hasProjects || loading}
            style={s.ghostBtnOnDark}
          >
            {loading ? 'Rafraichissement...' : 'Rafraichir'}
          </button>
          <button
            type="button"
            onClick={() => { setTaskId(''); setDateFrom(''); setDateTo(''); }}
            disabled={!hasProjects || loading}
            style={s.ghostBtnOnDark}
          >
            Reinitialiser filtres
          </button>
          <div style={{ marginLeft: 'auto', opacity: 0.85 }}>
            {filteredEntries.length} entree(s)
          </div>
        </div>
      </div>

      {/* Liste */}
      <section style={st.card}>
        <ul style={st.entryList}>
          {filteredEntries.map((e) => (
            <li key={e.id} style={st.entryItem}>
              <div style={{ display: 'grid', gap: 4 }}>
                <div style={st.badgeRow}>
                  {currentProject?.name && (
                    <span style={{ ...st.badgeBase, ...st.badgeProject }}>
                      {currentProject.name}
                    </span>
                  )}
                  <span style={{ ...st.badgeBase, ...st.badgeTask }}>
                    {e.taskName ?? 'Tache'}
                  </span>
                  <span style={{ ...st.badgeBase, ...st.badgeHours }}>
                    {formatHours(e.hoursLogged)}
                  </span>
                  <span style={{ ...st.badgeBase, ...st.badgeDate }}>
                    {formatDate(e.entryDate)}
                  </span>
                </div>

                <div style={st.entryTitle}>
                  {e.title || e.notes || '—'}
                </div>
              </div>

              <div style={st.itemActions}>
                {/* Redirige vers la page de saisie pour modifier */}
                <button
                  style={s.ghostBtnOnDark}
                  onClick={() => router.push('/time/new')}
                  title="Modifier cette entree sur la page Journal de temps"
                >
                  Modifier
                </button>
              </div>
            </li>
          ))}

          {filteredEntries.length === 0 && (
            <li style={{ color: '#9FB3CD', padding: '8px 0' }}>
              {projectId ? 'Aucune entree pour ces filtres.' : 'Selectionnez un projet pour afficher les entrees.'}
            </li>
          )}
        </ul>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            style={s.primaryBtn}
            onClick={() => router.push('/time/new')}
            title="Ajouter une entree (redirige)"
          >
            Ajouter une entree
          </button>
        </div>
      </section>
    </div>
  );
}
