"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import s from "./styles";

type Props = {
  projectCount?: number;
  children: React.ReactNode;
};

export default function DashboardShell({ projectCount, children }: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") return <p style={s.muted}>Chargement de la session…</p>;
  if (status === "unauthenticated") {
    signIn();
    return null;
  }

  const name = session?.user?.name ?? session?.user?.email ?? "Utilisateur";
  const email = session?.user?.email;

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={s.avatar}>{(name[0] ?? "U").toUpperCase()}</div>
            <div>
              <div style={s.heroTitle}>Bienvenue, {name}!</div>
              <div style={s.heroSub}>
                {email}
                {projectCount !== undefined ? ` • ${projectCount} projet${projectCount > 1 ? "s" : ""}` : null}
              </div>
            </div>
          </div>
          <button onClick={() => signOut()} style={s.outBtnOnDark}>Se déconnecter</button>
        </div>
      </div>

      {children}
    </div>
  );
}
