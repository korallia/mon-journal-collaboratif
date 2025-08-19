"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Fragment, useEffect, useState } from "react";
import s, { classes, globalPlaceholderCss } from "../dashboard/styles";
import TasksAccordion from "../tasks/TasksAccordion";
import { useToast } from "@/components/toast/ToastProvider";
import { useConfirm } from "@/components/confirm/ConfirmProvider";

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

// Scrollbar fine pour les conteneurs horizontaux (optionnel)
const globalScrollCss = `
  .dash-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(100,116,139,.45) transparent;
  }
  .dash-scroll::-webkit-scrollbar { height: 6px; }
  .dash-scroll::-webkit-scrollbar-track { background: transparent; }
  .dash-scroll::-webkit-scrollbar-thumb {
    background: rgba(100,116,139,.45);
    border-radius: 9999px;
  }
  .dash-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,.6); }
`;

export default function ProjectsPanel({ userId, onCountChange }: Props) {
  const confirm = useConfirm();
  const { error, promise } = useToast();

  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  // responsive
  const [isMobile, setIsMobile] = useState(false);  // < 640px => cartes
  const [isNarrow, setIsNarrow] = useState(false);  // < 980px => actions + étroites

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqNarrow = window.matchMedia("(max-width: 980px)");
    const update = () => {
      setIsMobile(mqMobile.matches);
      setIsNarrow(mqNarrow.matches);
    };
    update();
    mqMobile.addEventListener?.("change", update) ?? mqMobile.addListener(update);
    mqNarrow.addEventListener?.("change", update) ?? mqNarrow.addListener(update);
    return () => {
      mqMobile.removeEventListener?.("change", update) ?? mqMobile.removeListener(update);
      mqNarrow.removeEventListener?.("change", update) ?? mqNarrow.removeListener(update);
    };
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(API.listByUser(userId), { cache: "no-store" });
        if (!r.ok) throw new Error("Impossible de charger les projets.");
        const data = (await r.json()) as ProjectDTO[];
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

  // tes largeurs actuelles
  const actionsColWidth = isNarrow ? 310 : 380;
  const timeColWidth = 120;
  const dateColWidth = 210;

  // placeholder "temps total"
  function getRandomTime(): string {
    const h = Math.floor(Math.random() * 10);
    const m = Math.floor(Math.random() * 60);
    return `${h}h ${m}m`;
  }

  async function createProject() {
    if (!newName.trim()) return;
    try {
      const created = await promise(
        fetch(API.create, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: newName.trim(), userId }),
        }).then((r) =>
          r.ok ? r.json() : Promise.reject(new Error("Création impossible"))
        ),
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
        fetch(API.byId(id), {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: editName.trim() }),
        }).then((r) =>
          r.ok ? r.json() : Promise.reject(new Error("Mise à jour impossible"))
        ),
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
        fetch(API.byId(id), { method: "DELETE" }).then((r) =>
          r.ok || r.status === 204 ? true : Promise.reject(new Error("Suppression impossible"))
        ),
        { loading: "Suppression…", success: "Projet supprimé", error: "Échec de la suppression" }
      );
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setOpenProjectId((prev) => (prev === id ? null : prev));
    } catch {}
  }

  function formatDateShort(v?: string | null) {
    if (!v) return "—";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "—";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  return (
    <>
      {/* styles globaux placés en haut (évite le “nested styled-jsx”) */}
      <style jsx global>{globalScrollCss}</style>
      <style jsx global>{globalPlaceholderCss}</style>

      {/* Création */}
      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Nouveau projet</h2>
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

      {/* Liste */}
      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Mes projets</h2>

        {/* Mobile < 640px : cartes */}
        {isMobile ? (
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
                  <li key={p.id} style={s.projectCard}>
                    {/* Nom */}
                    <div style={s.projectName}>
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={s.input}
                          className={classes.textInput}
                        />
                      ) : (
                        p.name
                      )}
                    </div>

                    {/* Méta */}
                    <div style={s.metaGrid}>
                      <div>
                        <div style={s.metaLabel}>Créé le</div>
                        <div style={s.metaValue}>{formatDateShort(p.createdAt)}</div>
                      </div>
                      <div>
                        <div style={s.metaLabel}>Modifié le</div>
                        <div style={s.metaValue}>{formatDateShort(p.updatedAt)}</div>
                      </div>
                      <div>
                        <div style={s.metaLabel}>Temps total</div>
                        <div style={s.metaValue}>{getRandomTime()}</div>
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
          // Desktop / tablette : tableau
          <div className="dash-scroll" style={{ ...s.tableScroll, WebkitOverflowScrolling: "touch" }}>
            <table style={s.table}>
              <colgroup>
                <col style={{ width: "auto" }} />
                <col style={{ width: dateColWidth }} />
                <col style={{ width: dateColWidth }} />
                <col style={{ width: timeColWidth }} />
                <col style={{ width: actionsColWidth }} />
              </colgroup>

              <thead>
                <tr style={{ background: "#E5EAF1" }}>
                  <th style={s.th}>Nom</th>
                  <th style={{ ...s.th, width: dateColWidth }}>Créé le</th>
                  <th style={{ ...s.th, width: dateColWidth }}>Modifié le</th>
                  <th style={{ ...s.th, width: timeColWidth }}>Temps total</th>
                  <th style={{ ...s.th, width: actionsColWidth, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <p style={{ ...s.muted, margin: "16px 0" }}>
                        {loading ? "Chargement…" : "Aucun projet pour l’instant."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => {
                    const isEditing = editingId === p.id;
                    const isOpen = openProjectId === p.id;

                    return (
                      <Fragment key={p.id}>
                        <tr style={s.projectRow}>
                          {/* Nom */}
                          <td style={{ ...s.projectCell, ...s.projectCellFirst }}>
                            {isEditing ? (
                              <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className={classes.textInput}
                                style={s.input}
                              />
                            ) : (
                              p.name
                            )}
                          </td>

                          {/* Dates */}
                          <td style={{ ...s.projectCell, whiteSpace: "nowrap" }}>
                            {formatDateShort(p.createdAt)}
                          </td>
                          <td style={{ ...s.projectCell, whiteSpace: "nowrap" }}>
                            {formatDateShort(p.updatedAt)}
                          </td>

                          {/* Temps */}
                          <td style={{ ...s.projectCell, fontWeight: 600, whiteSpace: "nowrap" }}>
                            {getRandomTime()}
                          </td>

                          {/* Actions */}
                          <td style={{ ...s.projectCell, ...s.projectCellLast }}>
                            <div style={s.projectActions}>
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

                        {/* Accordéon tâches */}
                        {isOpen && (
                          <tr key={`${p.id}-tasks`}>
                            <td
                              colSpan={5}
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
