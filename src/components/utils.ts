export function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
export function toHours(h: number, m: number) {
  const hh = Number.isFinite(h) ? h : 0;
  const mm = Number.isFinite(m) ? m : 0;
  return hh + Math.max(0, Math.min(59, mm)) / 60;
}
export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
export function formatHours(h: number) {
  const whole = Math.floor(h);
  const min = Math.round((h - whole) * 60);
  return min ? `${whole} h ${min} min` : `${whole} h`;
}

// 💡 Progression générique: si tu as une cible d'heures (p.ex. project.targetHours),
// tu peux calculer un pourcentage. Par défaut: 0.
export function computeProgress(totalHours: number, targetHours?: number) {
  if (!targetHours || targetHours <= 0) return 0;
  const pct = (totalHours / targetHours) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

 export function getRandomTime(): string {
    const h = Math.floor(Math.random() * 10);
    const m = Math.floor(Math.random() * 60);
    return `${h}h ${m}m`;
  }

 export  function formatDateShort(v?: string | null) {
      if (!v) return "—";
      const d = new Date(v);
      if (isNaN(d.getTime())) return "—";
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
