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
  byId:   (id: string) => `/api/projects/${id}`,
};

type Props = {
  userId: string;
  onCountChange?: (n: number) => void;
};

export default function ProjectsPanel({ userId, onCountChange }: Props) {
  // Hooks globaux
  const confirm = useConfirm();             // dialog de confirmation custom
  const { error, promise } = useToast();    // toasts

  // État local
  const [projects, setProjects]   = useState<ProjectDTO[]>([]);
  const [loading, setLoading]     = useState(false);

  const [newName, setNewName]     = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName]   = useState("");

  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  // Responsive
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

    mqMobile.addEventListener?.("change", update) ?? mqMobile.addListener(update);
    mqNarrow.addEventListener?.("change", update) ?? mqNarrow.addListener(update);

    return () => {
      mqMobile.removeEventListener?.("change", update) ?? mqMobile.removeListener(update);
      mqNarrow.removeEventListener?.("change", update) ?? mqNarrow.removeListener(update);
    };
  }, []);

  // Charger la liste
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

  // ✅ Remontée du nombre au parent APRÈS render (évite l’erreur React)
  useEffect(() => {
    onCountChange?.(projects.length);
  }, [projects.length, onCountChange]);

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
    } catch {
      /* toast déjà géré par promise */
    }
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
    } catch {
      /* toast déjà géré par promise */
    }
  }

  async function remove(id: string) {
    const ok = await confirm({
      title:       "Supprimer ce projet ?",
      description: "Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText:  "Annuler",
      tone:        "danger",
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
    } catch {
      /* toast déjà géré par promise */
    }
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
          <style jsx global>{globalPlaceholderCss}</style>
          <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim() || loading}>
            Créer
          </button>
        </div>
      </section>

      {/* Liste */}
      <section style={s.card}>
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 8px 0" }}>Mes projets</h2>

        {/* MOBILE */}
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
                const isOpen    = openProjectId === p.id;

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
          // DESKTOP
          <div style={s.tableScroll}>
            <table style={s.table}>
              <thead>
                <tr style={{ background: "#E5EAF1" }}>
                  <th style={s.th}>Nom</th>
                  <th style={{ ...s.th, width: 220 }}>Créé le</th>
                  <th style={{ ...s.th, width: 220 }}>Modifié le</th>
                  {!isNarrow && <th style={s.th}>Description</th>}
                  <th style={{ ...s.th, width: isNarrow ? "280px" : "360px", textAlign: "center" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={isNarrow ? 4 : 5}>
                      <p style={{ ...s.muted, margin: "16px 0" }}>
                        {loading ? "Chargement…" : "Aucun projet pour l’instant."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => {
                    const isEditing = editingId === p.id;
                    const isOpen    = openProjectId === p.id;

                    return (
                      <Fragment key={p.id}>
                        <tr style={s.projectRow}>
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
                                minWidth: isNarrow ? 0 : 320,
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
