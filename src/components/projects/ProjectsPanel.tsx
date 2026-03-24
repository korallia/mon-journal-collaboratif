"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useState } from "react";
import s, { classes, globalPlaceholderCss,responsiveCss } from "../dashboard/styles";
import { projectStyles as projectS } from "../projects/style";
import { useToast } from "@/components/toast/ToastProvider";
import { useConfirm } from "@/components/confirm/ConfirmProvider";

import ProjectTable from "./ProjectTable";
import ProjectMobileCard from "./ProjectMobileCard";

import { useProjectBreakpoints } from "../projects/hooks/useProjectBreakpoints";

import type { ProjectDTO } from "./ProjectTable";
import { formatDateShort, getRandomTime } from "../utils";
import {
  listProjectsByUser,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from "../projects/api/projects.api";

type Props = {
  userId: string;
  onCountChange?: (n: number) => void;
};

export default function ProjectsPanel({ userId, onCountChange }: Props) {
  const confirm = useConfirm();
  const { error, promise } = useToast();
  const { isPhone, isTablet, isDesktop } = useProjectBreakpoints();

  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = (await listProjectsByUser(userId)) as ProjectDTO[];
        setProjects(data);
      } catch (e: any) {
        error(e?.message ?? "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, error]);

  useEffect(() => {
    onCountChange?.(projects.length);
  }, [projects.length, onCountChange]);

  const COLS = useMemo(() => {
    if (isDesktop) {
      return { dateW: 210, timeW: 120, actionsW: 360, mode: "desktop" as const };
    }
    if (isTablet) {
      return { dateW: 240, timeW: 90, actionsW: 260, mode: "tablet" as const };
    }
    return { dateW: 0, timeW: 0, actionsW: 0, mode: "phone" as const };
  }, [isDesktop, isTablet]);

  async function createProject() {
    if (!newName.trim()) return;

    try {
      const created = await promise(
        createProjectApi({ name: newName.trim(), userId }),
        { loading: "Création…", success: "Projet créé !", error: "Échec de la création" }
      );

      setProjects((prev) => [created as ProjectDTO, ...prev]);
      setNewName("");
    } catch {}
  }

  function beginEdit(p: ProjectDTO) {
    setEditingId(p.id);
    setEditName(p.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;

    try {
      const updated = await promise(
        updateProjectApi(id, editName.trim()),
        { loading: "Enregistrement…", success: "Projet modifié", error: "Échec de la modification" }
      );

      setProjects((prev) => prev.map((p) => (p.id === id ? (updated as ProjectDTO) : p)));
      cancelEdit();
    } catch {}
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Supprimer ce projet ?",
      description: "Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      tone: "danger",
    });

    if (!ok) return;

    try {
      await promise(
        deleteProjectApi(id),
        { loading: "Suppression…", success: "Projet supprimé", error: "Échec de la suppression" }
      );

      setProjects((prev) => prev.filter((p) => p.id !== id));
      setOpenProjectId((prev) => (prev === id ? null : prev));
    } catch {}
  }

  if (isPhone) {
    return (
      <>
        <style jsx global>{globalPlaceholderCss}</style>

        <section style={s.card}>
          <h2 style={projectS.projectTitle}>Nouveau projet</h2>
          <div style={s.row}>
            <input
              placeholder="Nom du projet"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={classes.textInput}
              style={s.input}
            />
            <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim() || loading}>
              Créer
            </button>
          </div>
        </section>

        <section style={s.card}>
          <h2 style={projectS.projectTitle}>Mes projets</h2>

          <ul style={s.listReset}>
            {projects.length === 0 ? (
              <li>
                <p style={{ ...s.muted, margin: "4px 0" }}>
                  {loading ? "Chargement…" : "Aucun projet pour l’instant."}
                </p>
              </li>
            ) : (
              projects.map((p) => {
                const isEditing = editingId === p.id;
                const isOpen = openProjectId === p.id;

                return (
                  <ProjectMobileCard
                    key={p.id}
                    project={p}
                    isEditing={isEditing}
                    isOpen={isOpen}
                    editName={isEditing ? editName : ""}
                    onEditNameChange={setEditName}
                    onBeginEdit={() => beginEdit(p)}
                    onCancelEdit={cancelEdit}
                    onSaveEdit={() => saveEdit(p.id)}
                    onRemove={() => remove(p.id)}
                    onToggleOpen={() => setOpenProjectId(isOpen ? null : p.id)}
                    formatDateShort={formatDateShort}
                    timeTotalLabel={getRandomTime()}
                  />
                );
              })
            )}
          </ul>
        </section>
      </>
    );
  }

  return (
    <>
      <style jsx global>{responsiveCss}</style>
      <style jsx global>{globalPlaceholderCss}</style>

      <section style={s.card}>
        <h2 style={projectS.projectTitle}>Nouveau projet</h2>
        <div style={s.row}>
          <input
            placeholder="Nom du projet"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={classes.textInput}
            style={s.input}
          />
          <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim() || loading}>
            Créer
          </button>
        </div>
      </section>

      <ProjectTable
        projects={projects}
        loading={loading}
        isNarrow={isTablet}
        mode={COLS.mode}
        cols={COLS}
        editingId={editingId}
        editName={editName}
        onEditNameChange={setEditName}
        onBeginEdit={beginEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
        onRemove={remove}
        openProjectId={openProjectId}
        onToggleOpen={(id) => setOpenProjectId((prev) => (prev === id ? null : id))}
        formatDateShort={formatDateShort}
        getRandomTime={getRandomTime}
      />
    </>
  );
}