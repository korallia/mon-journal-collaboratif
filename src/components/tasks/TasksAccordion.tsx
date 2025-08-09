"use client";

import { useEffect, useState } from "react";
import s from "../dashboard/styles";

const TASK_API = {
  listByProject: (projectId: string) => `/api/tasks?projectId=${projectId}`,
  create: `/api/tasks`,
  byId: (id: string) => `/api/tasks/${id}`,
};

export type TaskDTO = {
  id: string;
  projectId: string;
  title: string;
  done: boolean;
  createdAt: string;
};

type Props = {
  projectId: string;
  isOpen: boolean;
};

export default function TasksAccordion({ projectId, isOpen }: Props) {
  const [tasks, setTasks] = useState<TaskDTO[] | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // lazy-load
  useEffect(() => {
    if (!isOpen || tasks !== null) return;
    (async () => {
      const r = await fetch(TASK_API.listByProject(projectId));
      if (!r.ok) return setTasks([]);
      const data = (await r.json()) as TaskDTO[];
      setTasks(data);
    })();
  }, [isOpen, projectId, tasks]);

  if (!isOpen) return null;

  async function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    const r = await fetch(TASK_API.create, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ projectId, title }),
    });
    if (!r.ok) return;
    const created = (await r.json()) as TaskDTO;
    setTasks((prev) => [created, ...(prev ?? [])]);
    setNewTitle("");
  }

  async function toggleDone(task: TaskDTO) {
    const r = await fetch(TASK_API.byId(task.id), {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });
    if (!r.ok) return;
    const updated = (await r.json()) as TaskDTO;
    setTasks((prev) => (prev ?? []).map((t) => (t.id === task.id ? updated : t)));
  }

  async function removeTask(task: TaskDTO) {
    const ok = window.confirm("Supprimer cette tâche ?");
    if (!ok) return;
    const r = await fetch(TASK_API.byId(task.id), { method: "DELETE" });
    if (!r.ok && r.status !== 204) return;
    setTasks((prev) => (prev ?? []).filter((t) => t.id !== task.id));
  }

  return (
    <tr>
      <td colSpan={3} style={s.accordionCell}>
        <div style={s.taskAddRow}>
          <input
            placeholder="Nouvelle tâche"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={s.input}
          />
          <button onClick={addTask} style={s.primaryBtn}>Ajouter</button>
        </div>

        <ul style={s.taskList}>
          {(tasks ?? []).map((t) => (
            <li key={t.id} style={s.taskItem}>
              <label style={s.taskLabel}>
                <input type="checkbox" checked={t.done} onChange={() => toggleDone(t)} style={{ marginRight: 8 }} />
                <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
              </label>
              <button onClick={() => removeTask(t)} style={s.ghostBtn}>Supprimer</button>
            </li>
          ))}
          {tasks && tasks.length === 0 && <li style={s.muted}>Aucune tâche pour ce projet.</li>}
        </ul>
      </td>
    </tr>
  );
}
