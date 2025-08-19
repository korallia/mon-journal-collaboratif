"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import s from "./styles";
import { useRouter } from "next/navigation";

type Props = {
  projectCount?: number;
  children: React.ReactNode;
};

export default function DashboardShell({ projectCount, children }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const name = session?.user?.name ?? session?.user?.email ?? "Utilisateur";
  const email = session?.user?.email;

  // --- Responsive: mobile <= 640px
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener?.("change", update) ?? mq.addListener(update);
    return () =>
      mq.removeEventListener?.("change", update) ?? mq.removeListener(update);
  }, []);

  // Boutons: version "pleine largeur" en mobile
  const primaryBtn = isPhone
    ? { ...s.primaryBtn, width: "100%", justifyContent: "center" }
    : s.primaryBtn;

  const ghostBtn = isPhone
    ? { ...s.ghostBtnOnDark, width: "100%", justifyContent: "center" }
    : s.ghostBtnOnDark;

  // Conteneur des boutons: row sur desktop, colonne (empilé) sur mobile
  const topRightStyle = isPhone
    ? {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 8,
        width: "100%",
        marginTop: 8,
      }
    : s.topRight;

  // Ligne du hero: colonne sur mobile pour faire passer topRight sous le texte
  const heroRowStyle = isPhone
    ? { display: "flex", flexDirection: "column" as const, gap: 12 }
    : { display: "flex", alignItems: "center", justifyContent: "space-between" };

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div style={heroRowStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={s.avatar}>{(name[0] ?? "U").toUpperCase()}</div>
            <div>
              <div style={s.heroTitle}>Bienvenue, {name}!</div>
              <div style={s.heroSub}>
                {email}
                {projectCount !== undefined
                  ? ` • ${projectCount} projet${projectCount > 1 ? "s" : ""}`
                  : null}
              </div>
            </div>
          </div>

          <div style={topRightStyle}>
            <a href="/time/new" style={primaryBtn}>
              Journal de temps
            </a>
            <button style={ghostBtn}>Se déconnecter</button>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
