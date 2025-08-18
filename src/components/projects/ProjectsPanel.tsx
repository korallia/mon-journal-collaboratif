"use client";

import { Fragment, useEffect, useState } from "react";
import s, { classes, globalPlaceholderCss } from "../dashboard/styles";
import TasksAccordion from "../tasks/TasksAccordion";

export type ProjectDTO = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt?: string | null;
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

  // Responsive: mobile / narrow desktop
  const [isMobile, setIsMobile] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqNarrow = window.matchMedia("(max-width: 900px)");

    const update = () => {
      setIsMobile(mqMobile.matches);
      setIsNarrow(mqNarrow.matches);
    };

    update();

    // addEventListener fallback for older browsers
    if (mqMobile.addEventListener) mqMobile.addEventListener("change", update);
    else mqMobile.addListener(update);

    if (mqNarrow.addEventListener) mqNarrow.addEventListener("change", update);
    else mqNarrow.addListener(update);

    return () => {
      if (mqMobile.removeEventListener) mqMobile.removeEventListener("change", update);
      else mqMobile.removeListener(update);

      if (mqNarrow.removeEventListener) mqNarrow.removeEventListener("change", update);
      else mqNarrow.removeListener(update);
    };
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(API.listByUser(userId));
        const data = r.ok ? ((await r.json()) as ProjectDTO[]) : [];
        setProjects(data);
        onCountChange?.(data.length);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setErr(e?.message ?? "Erreur de chargement");
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

  // Date courte pour éviter les débordements
  function formatDateShort(v?: string | null) {
    if (!v) return "—";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "—";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  return (
    <>
      {err && <div style={s.alert}>{err}</div>}

      {/* Create */}
      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Nouveau projet</h2>
        <div style={s.row}>
          <input
            placeholder="Nom du projet"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={s.input}
          />

          <style jsx global>{globalPlaceholderCss}</style>
          <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim()}>
            Créer
          </button>
        </div>
      </section>

      {/* List */}
      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Mes projets</h2>

        {/* MOBILE: cartes compactes */}
        {isMobile ? (
          <ul style={s.listReset}>
            {projects.length === 0 ? (
              <li>
                <p style={{ ...s.muted, margin: "4px 0" }}>Aucun projet pour l’instant.</p>
              </li>
            ) : (
              projects.map((p) => {
                const isEditing = editingId === p.id;
                const isOpen = openProjectId === p.id;
                return (
                  <li key={p.id} style={s.projectCard}>
                    {/* Nom */}
                    <div style={s.projectName}>
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={s.input}
                        />
                      ) : (
                        p.name
                      )}
                    </div>

                    {/* Métadonnées */}
                    <div style={s.metaGrid}>
                      <div>
                        <div style={s.metaLabel}>Créé le</div>
                        <div style={s.metaValue}>{formatDateShort(p.createdAt)}</div>
                      </div>
                      <div>
                        <div style={s.metaLabel}>Modifié le</div>
                        <div style={s.metaValue}>{formatDateShort(p.updatedAt)}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={s.actionsRow}>
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(p.id)} style={s.primaryBtn}>
                            Enregistrer
                          </button>
                          <button onClick={cancelEdit} style={s.ghostBtnOnDark}>
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => beginEdit(p)} style={s.ghostBtnOnDark}>
                            Modifier
                          </button>
                          <button onClick={() => remove(p.id)} style={s.dangerBtn}>
                            Supprimer
                          </button>
                          <button
                            onClick={() => setOpenProjectId(isOpen ? null : p.id)}
                            style={s.secondaryBtnOnDark}
                          >
                            {isOpen ? "Fermer tâches" : "Tâches"}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Tâches */}
                    {isOpen && (
                      <div style={{ ...s.accordionCell, marginTop: 12 }}>
                        <TasksAccordion projectId={p.id} isOpen={isOpen} />
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        ) : (
          // DESKTOP: tableau (avec mode "narrow desktop" 641–900px)
          <div style={s.tableScroll}>
            <table style={s.table}>
              <thead>
                <tr style={{ background: "#E5EAF1" }}>
                  <th style={s.th}>Nom</th>
                  <th style={{ ...s.th, width: 220 }}>Créé le</th>
                  <th style={{ ...s.th, width: 220 }}>Modifié le</th>
                  {!isNarrow && <th style={s.th}>Description</th>}
                  <th
                    style={{
                      ...s.th,
                      width: isNarrow ? "280px" : "360px", // plus large en desktop
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={isNarrow ? 4 : 5}>
                      <p style={{ ...s.muted, margin: "16px 0" }}>Aucun projet pour l’instant.</p>
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => {
                    const isEditing = editingId === p.id;
                    const isOpen = openProjectId === p.id;
                    return (
                      <Fragment key={p.id}>
                        <tr style={s.projectRow}>
                          <td style={{ ...s.projectCell, ...s.projectCellFirst }}>
                            {isEditing ? (
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={s.input}
                              />
                            ) : (
                              p.name
                            )}
                          </td>

                          <td
                            style={{
                              ...s.projectCell,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 220,
                            }}
                          >
                            {formatDateShort(p.createdAt)}
                          </td>

                          <td
                            style={{
                              ...s.projectCell,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 220,
                            }}
                          >
                            {formatDateShort(p.updatedAt)}
                          </td>

                          {!isNarrow && <td style={s.projectCell}>Lorem ipsum</td>}

                          <td style={{ ...s.projectCell, ...s.projectCellLast }}>
                            <div
                              style={{
                                ...s.projectActions,
                                flexWrap: isNarrow ? "wrap" : "nowrap",
                                rowGap: 8,
                                alignItems: "center",
                                minWidth:  0 ,
                              }}
                            >
                              {isEditing ? (
                                <>
                                  <button onClick={() => saveEdit(p.id)} style={s.primaryBtn}>
                                    Enregistrer
                                  </button>
                                  <button onClick={cancelEdit} style={s.ghostBtnOnDark}>
                                    Annuler
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => beginEdit(p)} style={s.ghostBtnOnDark}>
                                    Modifier
                                  </button>
                                  <button onClick={() => remove(p.id)} style={s.dangerBtn}>
                                    Supprimer
                                  </button>
                                  <button
                                    onClick={() => setOpenProjectId(isOpen ? null : p.id)}
                                    style={s.secondaryBtnOnDark}
                                  >
                                    {isOpen ? "Fermer tâches" : "Tâches"}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>

                        {isOpen && (
                          <tr key={`${p.id}-tasks`}>
                            <td
                              colSpan={isNarrow ? 4 : 5}
                              style={{
                                padding: "0 8px 10px 8px",
                                background: "#3b4861ff",
                                borderBottomLeftRadius: 16,
                                borderBottomRightRadius: 16,
                              }}
                            >
                              <TasksAccordion projectId={p.id} isOpen={isOpen} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}