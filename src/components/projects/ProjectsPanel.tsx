"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Fragment, useEffect, useMemo, useState } from "react";
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

// Helper responsive flags
function useBreakpoints() {
  const [flags, setFlags] = useState({ isPhone: false, isTablet: false, isDesktop: true });

  useEffect(() => {
    const mqPhone = window.matchMedia("(max-width: 640px)");
    const mqTablet = window.matchMedia("(max-width: 1024px)");
    const update = () =>
      setFlags({
        isPhone: mqPhone.matches,
        isTablet: !mqPhone.matches && mqTablet.matches,
        isDesktop: !mqTablet.matches,
      });
    update();
    mqPhone.addEventListener?.("change", update) ?? mqPhone.addListener(update);
    mqTablet.addEventListener?.("change", update) ?? mqTablet.addListener(update);
    return () => {
      mqPhone.removeEventListener?.("change", update) ?? mqPhone.removeListener(update);
      mqTablet.removeEventListener?.("change", update) ?? mqTablet.removeListener(update);
    };
  }, []);

  return flags;
}

export default function ProjectsPanel({ userId, onCountChange }: Props) {
  const confirm = useConfirm();
  const { error, promise } = useToast();
  const { isPhone, isTablet, isDesktop } = useBreakpoints();

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

  const COLS = useMemo(() => {
    if (isDesktop) {
      return { dateW: 210, timeW: 120, actionsW: 360, mode: "desktop" as const };
    }
    if (isTablet) {
      // Col "Dates" unique, boutons compacts
      return { dateW: 260, timeW: 90, actionsW: 270, mode: "tablet" as const };
    }
    return { dateW: 0, timeW: 0, actionsW: 0, mode: "phone" as const };
  }, [isDesktop, isTablet]);

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
        }).then((r) => (r.ok ? r.json() : Promise.reject(new Error("Création impossible")))),
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
        }).then((r) => (r.ok ? r.json() : Promise.reject(new Error("Mise à jour impossible")))),
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

  // --- Mobile (cartes)
  if (isPhone) {
    return (
      <>
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
            <style jsx global>{globalPlaceholderCss}</style>
            <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim() || loading}>
              Créer
            </button>
          </div>
        </section>

        <section style={s.card}>
          <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Mes projets</h2>
          <ul style={s.listReset}>
            {projects.length === 0 ? (
              <li>
                <p style={{ ...s.muted, margin: "4px 0" }}>{loading ? "Chargement…" : "Aucun projet pour l’instant."}</p>
              </li>
            ) : (
              projects.map((p) => {
                const isEditing = editingId === p.id;
                const isOpen = openProjectId === p.id;
                return (
                  <li key={p.id} style={s.projectCard}>
                    <div style={s.projectName}>
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
                    </div>
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
                    <div style={{ ...s.metaGrid, marginTop: 6 }}>
                      <div>
                        <div style={s.metaLabel}>Temps total</div>
                        <div style={s.metaValue}>{getRandomTime()}</div>
                      </div>
                    </div>

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
        </section>
      </>
    );
  }

  // --- Desktop & tablette (tableau)
  return (
    <>
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
          <style jsx global>{globalPlaceholderCss}</style>
          <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim() || loading}>
            Créer
          </button>
        </div>
      </section>

      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Mes projets</h2>

        <div style={s.tableScroll}>
          <table style={s.table}>
            <colgroup>
              <col style={{ width: "auto" }} />
              {COLS.mode === "desktop" ? (
                <>
                  <col style={{ width: COLS.dateW }} />
                  <col style={{ width: COLS.dateW }} />
                </>
              ) : (
                <col style={{ width: COLS.dateW }} />
              )}
              <col style={{ width: COLS.timeW }} />
              <col style={{ width: COLS.actionsW }} />
            </colgroup>

            <thead>
              <tr style={{ background: "#E5EAF1" }}>
                <th style={s.th}>Nom</th>
                {COLS.mode === "desktop" ? (
                  <>
                    <th style={{ ...s.th, width: COLS.dateW }}>Créé le</th>
                    <th style={{ ...s.th, width: COLS.dateW }}>Modifié le</th>
                  </>
                ) : (
                  <th style={{ ...s.th, width: COLS.dateW }}>Dates</th>
                )}
                <th style={{ ...s.th, width: COLS.timeW }}>Temps total</th>
                <th style={{ ...s.th, width: COLS.actionsW, textAlign: "center" }}>Actions</th>
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
                        {COLS.mode === "desktop" ? (
                          <>
                            <td style={{ ...s.projectCell }}>{formatDateShort(p.createdAt)}</td>
                            <td style={{ ...s.projectCell }}>{formatDateShort(p.updatedAt)}</td>
                          </>
                        ) : (
                          <td style={{ ...s.projectCell }}>
                            <div style={s.metaStack}>
                              <span>
                                <span style={s.metaTiny}>Créé:</span> {formatDateShort(p.createdAt)}
                              </span>
                              <span>
                                <span style={s.metaTiny}>Modifié:</span> {formatDateShort(p.updatedAt)}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* Temps total (placeholder) */}
                        <td style={{ ...s.projectCell, fontWeight: 600 }}>{getRandomTime()}</td>

                        {/* Actions */}
                        <td style={{ ...s.projectCell, ...s.projectCellLast }}>
                          <div style={s.projectActions}>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(p.id)}
                                  style={isTablet ? s.primaryBtnSm : s.primaryBtn}
                                >
                                  Enregistrer
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  style={isTablet ? s.ghostBtnOnDarkSm : s.ghostBtnOnDark}
                                >
                                  Annuler
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => beginEdit(p)}
                                  style={isTablet ? s.ghostBtnOnDarkSm : s.ghostBtnOnDark}
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => remove(p.id)}
                                  style={isTablet ? s.dangerBtnSm : s.dangerBtn}
                                >
                                  Supprimer
                                </button>
                                <button
                                  onClick={() => setOpenProjectId(isOpen ? null : p.id)}
                                  style={isTablet ? s.secondaryBtnOnDarkSm : s.secondaryBtnOnDark}
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
                            colSpan={COLS.mode === "desktop" ? 5 : 4}
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
      </section>
    </>
  );
}
