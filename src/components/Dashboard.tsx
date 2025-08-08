"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  if (status === "unauthenticated") {
    signIn(); // Redirige automatiquement vers la page de login
    return null;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Bienvenue, {session?.user?.name} !</h1>
      <p>Vous êtes connecté en tant que {session?.user?.email}</p>
      <button onClick={() => signOut()}>Se déconnecter</button>
    </div>
  );
}
