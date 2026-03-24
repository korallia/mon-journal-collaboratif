"use client";

import { useSession } from "next-auth/react";
import s, { globalPlaceholderCss, responsiveCss } from "./styles";
import { useRouter } from "next/navigation";

type Props = {
  projectCount?: number;
  children: React.ReactNode;
};

export default function DashboardShell({ projectCount, children }: Props) {
  const { data: session } = useSession();

  const name = session?.user?.name ?? session?.user?.email ?? "Utilisateur";
  const email = session?.user?.email;

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div style={s.heroRow} className="dash-hero-row">
          <div style={s.heroLeft} className="dash-hero-left">
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

          <div style={s.topRight} className="dash-top-right">
            <a href="/time/new" style={s.primaryBtn} className="dash-primary-btn">
              Journal de temps
            </a>
            <button style={s.ghostBtnOnDark} className="dash-ghost-btn">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {children}
        <style jsx global>{`
      ${globalPlaceholderCss}
      ${responsiveCss}
    `}</style>
    </div>
  );
}