// src/components/dashboard/ProjectsPanel.tsx

"use client";

import { Fragment, useEffect, useState } from "react";
import s from "../dashboard/styles";
import TasksAccordion from "../tasks/TasksAccordion";

export type ProjectDTO = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const API = {
  listByUser: (userId: string) => `/api/projects/user/${userId}`,
  create: `/api/projects`,
  byId: (id: string) => `/api/projects/${id}`,
};

type Props = {
  userId: string;
  onCountChange?: (n: number) => void;
};

export default function ProjectsPanel({ userId, onCountChange }: Props) {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(API.listByUser(userId));
        const data = r.ok ? ((await r.json()) as ProjectDTO[]) : [];
        setProjects(data);
        onCountChange?.(data.length);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, onCountChange]);

  async function createProject() {
    if (!newName.trim()) return;
    const r = await fetch(API.create, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), userId }),
    });
    if (!r.ok) return;
    const created = (await r.json()) as ProjectDTO;
    setProjects((prev) => [created, ...prev]);
    onCountChange?.(projects.length + 1);
    setNewName("");
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
    const r = await fetch(API.byId(id), {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    if (!r.ok) return;
    const updated = (await r.json()) as ProjectDTO;
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    cancelEdit();
  }

  async function remove(id: string) {
    const ok = window.confirm("Supprimer ce projet ?");
    if (!ok) return;
    const r = await fetch(API.byId(id), { method: "DELETE" });
    if (!r.ok && r.status !== 204) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    onCountChange?.(projects.length - 1);
    setOpenProjectId((prev) => (prev === id ? null : prev));
  }

  return (
    <>
      {err && <div style={s.alert}>{err}</div>}

      {/* Créer un nouveau projet */}
      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Nouveau projet</h2>
        <div style={s.row}>
          <input placeholder="Nom du projet" value={newName} onChange={(e) => setNewName(e.target.value)} style={s.input} />
          <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim()}>
            Créer
          </button>
        </div>
      </section>

      {/* Liste des projets */}
      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Mes projets</h2>
        <div style={s.tableHeader}>
          <div style={s.headerItem}>Nom</div>
          <div style={s.headerItem}>Créé le</div>
          <div style={s.headerItem}>Modifié le</div>
          <div style={s.headerItem}>Description</div>
          <div style={s.headerActions}>Actions</div>
        </div>

        {projects.length === 0 ? (
          <p style={s.muted}>Aucun projet pour l’instant.</p>
        ) : (
          <div>
            {projects.map((p) => {
              const isEditing = editingId === p.id;
              const isOpen = openProjectId === p.id;
              return (
                <Fragment key={p.id}>
                  <div style={s.projectRow}>
                    <div style={s.projectItem}>
                      {isEditing ? (
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} style={s.input} />
                      ) : (
                        p.name
                      )}
                    </div>
                    <div style={s.projectItem}>{new Date(p.createdAt).toLocaleString()}</div>
                    <div style={s.projectItem}>{new Date(p.updatedAt).toLocaleString()}</div>
                    <div style={s.projectItem}>Lorem ipsum</div>
                    <div style={s.projectActions}>
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(p.id)} style={s.primaryBtn}>Enregistrer</button>
                          <button onClick={cancelEdit} style={s.ghostBtnOnDark}>Annuler</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => beginEdit(p)} style={s.ghostBtnOnDark}>Modifier</button>
                          <button onClick={() => remove(p.id)} style={s.dangerBtn}>Supprimer</button>
                          <button onClick={() => setOpenProjectId(isOpen ? null : p.id)} style={s.secondaryBtnOnDark}>
                            {isOpen ? "Fermer tâches" : "Tâches"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {isOpen && <TasksAccordion projectId={p.id} isOpen={isOpen} />}
                </Fragment>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}