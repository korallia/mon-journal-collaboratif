"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProjectsPanel from "@/components/projects/ProjectsPanel";
import InstallBanner from "@/components/InstallBanner";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
const router = useRouter(); // Initialisez le hook de routage
  
  const { data: session, status } = useSession();
const userId = useMemo(() => (session?.user as { id?: string } | undefined)?.id, [session]);
  const [projectCount, setProjectCount] = useState<number | undefined>(undefined);

  if (status === "loading") {
        // Affichez un état de chargement, comme un spinner
    }

     if (status === "unauthenticated") {
        // Redirigez l'utilisateur ou affichez un message d'erreur
        // Le middleware devrait déjà avoir géré cette redirection, mais c'est une sécurité
        router.push('/auth/login')
    }

  if (!userId) return <p style={{ textAlign: "center", marginTop: 40 }}>Connexion requise…</p>;

  return (
    <DashboardShell projectCount={projectCount}>
      <ProjectsPanel userId={userId} onCountChange={setProjectCount} />
      <InstallBanner />
    </DashboardShell>
  );
}