"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

// ✅ imports SANS accolades (default imports)
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProjectsPanel from "@/components/projects/ProjectsPanel";
import InstallBanner from "@/components/InstallBanner";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userId = useMemo(() => (session?.user as { id?: string } | undefined)?.id, [session]);
  const [projectCount, setProjectCount] = useState<number | undefined>(undefined);

  if (!userId) return <p style={{ textAlign: "center", marginTop: 40 }}>Connexion requise…</p>;

  return (
    <DashboardShell projectCount={projectCount}>
      <ProjectsPanel userId={userId} onCountChange={setProjectCount} />
      <InstallBanner />
    </DashboardShell>
  );
}
