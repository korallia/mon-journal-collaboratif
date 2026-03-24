'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Boutons/looks dashboard
import s from '../../../components/dashboard/styles';

// Imports directs (adapte les chemins si besoin)
import { useTimeJournal } from '../../../components/time_journal/hooks/useTimeJournal';
import TimeHeader from '../../../components/time_journal/ui/TimeHeader';
import ProjectPicker from '../../../components/time_journal/ui/ProjectPicker';
import EntryForm from '../../../components/time_journal/ui/EntryForm';
import EntryList from '../../../components/time_journal/ui/EntryList';
import  st   from '../../../components/time_journal/timeStyles';
import { computeProgress } from '../../../components/utils';
export default function TimePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  const j = useTimeJournal({ status: status as any, userId });

  const {
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
    entries, reloadEntries, handleSubmit, onDelete, onEdit, resetForm,

    // état
    loadingProjects, noProjects, errorMsg, currentProject, hasProjects, disabled,
    isEditing, cancelEdit,
  } = j;

  // Redirige si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  

  // Progression (optionnel)
  const totalHours = entries.reduce((sum, e) => sum + (e.hoursLogged || 0), 0);


  return (
    <div style={st.container}>
      <TimeHeader
        status={status as any}
        loadingProjects={loadingProjects}
        hasProjects={hasProjects}
        currentProjectName={currentProject?.name}
        errorMsg={errorMsg}
        s={s}
        total_time={totalHours}
      />

      {/* Bloc "picker" façon dashboard */}
      <div style={st.panelLight}>
        <ProjectPicker
          projects={projects}
          projectId={projectId}
          setProjectId={setProjectId}
          disabled={disabled}
        />
      </div>

      {/* CTA si aucun projet */}
      {status === 'authenticated' && !loadingProjects && !hasProjects && (
        <div style={{ ...st.card, display: 'flex', alignItems: 'center', gap: 12, }}>
          <span>Vous n’avez pas encore de projet.</span>
          <Link href="/dashboard" style={s.primaryBtn}>Créer un projet</Link>
        </div>
      )}

      {/* Formulaire + liste */}
      <div style={st.stack}>
        <EntryForm
          tasks={tasks}
          taskId={taskId}
          setTaskId={setTaskId}
          entryDate={entryDate}
          setEntryDate={setEntryDate}
          hours={hours}
          setHours={setHours}
          minutes={minutes}
          setMinutes={setMinutes}
          notes={notes}
          setNotes={setNotes}
          entryTitle={entryTitle}
          setEntryTitle={setEntryTitle}
          disabled={disabled}
          onSubmit={handleSubmit}
          onReset={resetForm}
          // mode édition
          isEditing={isEditing}
          onCancelEdit={cancelEdit}
          s={s}
        />

        <EntryList
          entries={entries}
          onEdit={onEdit}                // <== IMPORTANT: EntryList doit appeler onEdit(entry), pas onEdit(id)
          onDelete={onDelete}
          onRefresh={() => reloadEntries(projectId || undefined)}
          hasProjects={hasProjects}
          projectLabel={currentProject?.name}
          s={s}
        />
      </div>
    </div>
  );
}
