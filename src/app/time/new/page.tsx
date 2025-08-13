'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import s from '../../../components/dashboard/styles'; // 👉 adapte le chemin si besoin
import {
  useTimeJournal,
  TimeHeader,
  ProjectPicker,
  EntryForm,
  EntryList,
  computeProgress,
  st as timeSt,
} from '../../../components/time_journal';

export default function TimePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  const j = useTimeJournal({ status: status as any, userId });
  const {
    // selections
    projects, projectId, setProjectId,
    tasks, taskId, setTaskId,
    // form
    entryDate, setEntryDate, hours, setHours, minutes, setMinutes, notes, setNotes, entryTitle, setEntryTitle,
    // entries
    entries, reloadEntries, handleCreateEntry, onDelete, onEdit, resetForm,
    // state
    loadingProjects, noProjects, errorMsg, currentProject, hasProjects, disabled,

  } = j;

  // Auth: redirige si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  // Redirection si pas de projets
  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!loadingProjects && noProjects) {
      const t = setTimeout(() => router.push('/dashboard'), 1800);
      return () => clearTimeout(t);
    }
  }, [status, loadingProjects, noProjects, router]);

  // 🔢 Exemple de calcul de progression basé sur des heures cibles facultatives
  const totalHours = entries.reduce((sum, e) => sum + (e.hoursLogged || 0), 0);
  const targetHours = currentProject?.targetHours; // si tu l’ajoutes côté API
  const progressValue = computeProgress(totalHours, targetHours);

  return (
    <div style={timeSt.container}>
      <TimeHeader
        status={status as any}
        loadingProjects={loadingProjects}
        hasProjects={hasProjects}
        currentProjectName={currentProject?.name}
        errorMsg={errorMsg}
        s={s}
        progressValue={progressValue}
      />

      <div style={timeSt.panelLight}>
  <ProjectPicker
    projects={projects}
    projectId={projectId}
    setProjectId={setProjectId}
    disabled={disabled}
  />
</div>


      {/* CTA si aucun projet */}
      {status === 'authenticated' && !loadingProjects && !hasProjects && (
        <div style={{ ...timeSt.card, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Vous n’avez pas encore de projet.</span>
          <Link href="/dashboard" style={s.primaryBtn}>Créer un projet</Link>
        </div>
      )}

      {/* Stack: form + entries */}
      <div style={timeSt.stack}>
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
          disabled={disabled}
          onSubmit={handleCreateEntry}
          onReset={resetForm}
          s={s}
          entryTitle={entryTitle}   
        setEntryTitle={setEntryTitle}
        />

        <EntryList
          entries={entries}
          onEdit={onEdit}
          onDelete={onDelete}
          onRefresh={() => reloadEntries(projectId || undefined)}
          hasProjects={hasProjects}
          s={s}
        />
      </div>
    </div>
  );
}