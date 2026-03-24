export type CreateProjectInput = {
  name: string;
  userId: string;
};

export async function listProjectsByUser(userId: string) {
  const r = await fetch(`/api/projects/user/${userId}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Impossible de charger les projets.");
  return r.json();
}

export async function createProjectApi(input: CreateProjectInput) {
  const r = await fetch(`/api/projects`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!r.ok) throw new Error("Création impossible");
  return r.json();
}

export async function updateProjectApi(id: string, name: string) {
  const r = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!r.ok) throw new Error("Mise à jour impossible");
  return r.json();
}

export async function deleteProjectApi(id: string) {
  const r = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });

  if (!(r.ok || r.status === 204)) {
    throw new Error("Suppression impossible");
  }

  return true;
}