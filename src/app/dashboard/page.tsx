/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

// Ajuste si besoin
const API = {
  listByUser: (userId: string) => `/api/projects/user/${userId}`,
  create: `/api/projects`,
  byId: (id: string) => `/api/projects/${id}`,
};

type ProjectDTO = {
  id: string;
  userId: string;
  name: string;
  createdAt: string; // ISO
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  // UI state
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // create
  const [newName, setNewName] = useState("");

  // inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const isAuthed = status === "authenticated";

  const title = useMemo(() => {
    const n = session?.user?.name ?? session?.user?.email ?? "Utilisateur";
    return `Bienvenue, ${n}!`;
  }, [session]);

  // Load projects
  useEffect(() => {
    if (!isAuthed || !userId) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const r = await fetch(API.listByUser(userId), { method: "GET" });
        if (!r.ok) throw new Error(`Load failed (${r.status})`);
        const data = (await r.json()) as ProjectDTO[];
        setProjects(data);
      } catch (e: any) {
        setErr(e.message ?? "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthed, userId]);

  if (status === "loading") return <p style={s.muted}>Chargement de la session…</p>;
  if (status === "unauthenticated") {
    signIn(); // redirige automatiquement
    return null;
  }

  if (!userId) {
    return (
      <div style={s.center}>
        <h1 style={s.h1}>{title}</h1>
        <p style={s.error}>
          L’ID utilisateur est introuvable dans la session. Assure-toi que NextAuth
          expose <code>session.user.id</code> (Prisma Adapter le fait par défaut).
        </p>
      </div>
    );
  }

  // Actions
  async function createProject() {
    if (!newName.trim()) return;
    try {
      setErr(null);
      const r = await fetch(API.create, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), userId }),
      });
      if (!r.ok) throw new Error(`Create failed (${r.status})`);
      const created = (await r.json()) as ProjectDTO;
      setProjects((prev) => [created, ...prev]);
      setNewName("");
    } catch (e: any) {
      setErr(e.message ?? "Création impossible");
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
      setErr(null);
      const r = await fetch(API.byId(id), {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!r.ok) throw new Error(`Update failed (${r.status})`);
      const updated = (await r.json()) as ProjectDTO;
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      cancelEdit();
    } catch (e: any) {
      setErr(e.message ?? "Mise à jour impossible");
    }
  }

  async function remove(id: string) {
    const ok = window.confirm("Supprimer ce projet ?");
    if (!ok) return;
    try {
      setErr(null);
      const r = await fetch(API.byId(id), { method: "DELETE" });
      if (!r.ok && r.status !== 204) throw new Error(`Delete failed (${r.status})`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setErr(e.message ?? "Suppression impossible");
    }
  }

  return (
    <div style={s.container}>
      {/* TOP BANNER */}
<div style={s.hero}>
  <div style={s.heroRow}>
    <div style={s.heroLeft}>
      <div style={s.avatar}>
        {(session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? 'U').toUpperCase()}
      </div>
      <div>
        <div style={s.heroTitle}>{title}</div>
        <div style={s.heroSub}>
          {session?.user?.email} • {projects.length} projet{projects.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>

    <button onClick={() => signOut()} style={s.outBtnOnDark}>
      Se déconnecter
    </button>
  </div>
</div>

      {err && <div style={s.alert}>{err}</div>}

      {/* Create */}
      <section style={s.card}>
        <h2 style={s.h2}>Nouveau projet</h2>
        <div style={s.row}>
          <input
            placeholder="Nom du projet"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={s.input}
          />
          <button onClick={createProject} style={s.primaryBtn} disabled={!newName.trim()}>
            Créer
          </button>
        </div>
      </section>

      {/* List */}
      <section style={s.card}>
        <div style={s.listHeader}>
          <h2 style={s.h2}>Mes projets</h2>
          {loading && <span style={s.muted}>Chargement…</span>}
        </div>

        {projects.length === 0 ? (
          <p style={s.muted}>Aucun projet pour l’instant.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Nom</th>
                <th style={s.th}>Créé le</th>
                <th style={s.th} />
              </tr>
            </thead>
<tbody>
  {projects.map((p) => {
    const isEditing = editingId === p.id;
    return (
      <tr key={p.id}>
        <td style={s.tdOnDarkFirst}>
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

        <td style={s.tdOnDark}>
          {new Date(p.createdAt).toLocaleString()}
        </td>

        <td style={{ ...s.tdOnDarkLast, textAlign: "right", whiteSpace: "nowrap" }}>
          {isEditing ? (
            <>
              <button onClick={() => saveEdit(p.id)} style={s.primaryBtn}>Enregistrer</button>
              <button onClick={cancelEdit} style={s.ghostBtnOnDark}>Annuler</button>
            </>
          ) : (
            <>
              <button onClick={() => beginEdit(p)} style={s.ghostBtnOnDark}>Modifier</button>
              <button onClick={() => remove(p.id)} style={s.dangerBtn}>Supprimer</button>
            </>
          )}
        </td>
      </tr>
    );
  })}
</tbody>


          </table>
        )}
      </section>
    </div>
  );
}

/* —————————————————— styles ultra light (no Tailwind) —————————————————— */
const s: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "40px auto", padding: "0 16px" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
  },
  h1: { fontSize: "1.8rem", margin: 0 },
  h2: { fontSize: "1.2rem", margin: "0 0 8px 0" },
  muted: { color: "#6b7280" },
  alert: {
    background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A",
    padding: 12, borderRadius: 8, marginBottom: 16,
  },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 16 },
  row: { display: "flex", gap: 8, alignItems: "center" },
  input: {
    flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db", outline: "none",
  },
  table: {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 8px",       // espace vertical entre les lignes
},
  th: { textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontWeight: 600 },
  td: { padding: "10px 8px", borderBottom: "1px solid #f3f4f6" },
  primaryBtn: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #1E293B",
    backgroundColor: '#1E293B', // Bleu foncé chaleureux
    color: '#FFFFFF', cursor: "pointer", marginLeft: 4,
  },
  dangerBtn: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #ef4444",
    background: "#ef4444", color: "#fff", cursor: "pointer", marginLeft: 4,
  },
  ghostBtn: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
    background: "#fff", color: "#111827", cursor: "pointer", marginLeft: 4,
  },
  outBtn: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
    background: "#fff", cursor: "pointer",
  },
  center: { maxWidth: 800, margin: "40px auto", padding: "0 16px", textAlign: "center" },
  error: { color: "#b91c1c" },
  hero: {
  backgroundColor: '#1E293B', // bleu foncé
  color: '#FFFFFF',
  borderRadius: 16,
  padding: '20px 24px',
  marginBottom: 24,
  boxShadow: '0 8px 20px rgba(2, 6, 23, 0.15)',
},
heroRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
heroLeft: { display: 'flex', alignItems: 'center', gap: 12 },
avatar: {
  width: 44, height: 44, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#334155', color: '#fff', fontWeight: 700, fontSize: 18,
  boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)',
},
heroTitle: { fontSize: '1.5rem', fontWeight: 700, margin: 0 },
heroSub: { opacity: 0.85, fontSize: 14, marginTop: 2 },

outBtnOnDark: {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,.35)',
  background: 'transparent',
  color: '#fff',
  cursor: 'pointer',
},
rowAccent: {
  background: '#1E293B',
},
tdOnDark: {
  background: "#1E293B",
  color: "#FFFFFF",
  padding: "10px 8px",
  border: "none",
},
ghostBtnOnDark: {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,.35)",
  background: "transparent",
  backgroundColor: '#4B5563', // Gris neutre doux
  color: '#FFFFFF',
  cursor: "pointer",
  marginLeft: 4,
},
tdOnDarkFirst: {
  background: "#1E293B",
  color: "#FFFFFF",
  padding: "10px 8px",
  border: "none",
  borderTopLeftRadius: 16,
  borderBottomLeftRadius: 16,
},
tdOnDarkLast: {
  background: "#1E293B",
  color: "#FFFFFF",
  padding: "10px 8px",
  border: "none",
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
},

};
