'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

type ToastKind = 'success' | 'error' | 'info' | 'warning' | 'loading';

export type ToastOptions = {
  id?: string;
  title?: string;
  duration?: number; // ms (undefined => persistant)
};

export type Toast = {
  id: string;
  kind: ToastKind;
  message: string;
  title?: string;
  duration?: number;
  createdAt: number;
};

type ToastAPI = {
  toasts: Toast[];
  show: (kind: ToastKind, message: string, opts?: ToastOptions) => string;
  dismiss: (id?: string) => void;
  // alias pratiques
  success: (msg: string, opts?: ToastOptions) => string;
  error: (msg: string, opts?: ToastOptions) => string;
  info: (msg: string, opts?: ToastOptions) => string;
  warning: (msg: string, opts?: ToastOptions) => string;
  loading: (msg: string, opts?: ToastOptions) => string;
  // helper pour promesse
  promise: <T>(
    p: Promise<T>,
    labels: { loading?: string; success?: string; error?: string },
    opts?: { duration?: number }
  ) => Promise<T>;
};

const ToastCtx = createContext<ToastAPI | null>(null);

const colors = {
  bg: '#232e41',         // fond sombre
  panel: '#0f172a',
  border: 'rgba(255,255,255,.18)',
  text: '#E6EEF9',
  success: '#22C55E',
  error: '#EF4444',
  info: '#3B82F6',
  warning: '#F59E0B',
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 9999,
  top: 16,
  right: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  pointerEvents: 'none', // laissez les clics passer sauf sur le toast
};

const cardStyleBase: React.CSSProperties = {
  pointerEvents: 'auto',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: 10,
  alignItems: 'center',
  minWidth: 280,
  maxWidth: 420,
  padding: '12px 14px',
  borderRadius: 12,
  border: `1px solid ${colors.border}`,
  background: colors.bg,
  color: colors.text,
  boxShadow: '0 12px 30px rgba(2,6,23,.35)',
};

const stripe = (c: string): React.CSSProperties => ({
  width: 6,
  height: '100%',
  borderRadius: 8,
  background: c,
});

const btnClose: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${colors.border}`,
  color: colors.text,
  borderRadius: 8,
  padding: '4px 8px',
  cursor: 'pointer',
  opacity: 0.9,
};

function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  useEffect(() => {
    // global key: escape => close last
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length) onDismiss(toasts[toasts.length - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toasts, onDismiss]);

  return (
    <>
      <div style={containerStyle} aria-live="polite" aria-atomic="true">
        {toasts.map((t) => {
          const color =
            t.kind === 'success'
              ? colors.success
              : t.kind === 'error'
              ? colors.error
              : t.kind === 'warning'
              ? colors.warning
              : t.kind === 'loading'
              ? colors.info
              : colors.info;

          return (
            <div key={t.id} style={{ ...cardStyleBase, animation: 'toast-in .18s ease-out' }}>
              <div style={stripe(color)} />
              <div>
                {t.title && (
                  <div style={{ fontWeight: 700, marginBottom: 2, letterSpacing: 0.2 }}>{t.title}</div>
                )}
                <div>{t.message}</div>
              </div>
              <button
                aria-label="Fermer la notification"
                style={btnClose}
                onClick={() => onDismiss(t.id)}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Animations globales */}
      <style jsx global>{`
        @keyframes toast-in {
          from {
            transform: translateY(-6px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => (id ? prev.filter((t) => t.id !== id) : []));
  }, []);

  const show = useCallback(
    (kind: ToastKind, message: string, opts?: ToastOptions) => {
      const id = opts?.id ?? crypto.randomUUID();
      const toast: Toast = {
        id,
        kind,
        message,
        title: opts?.title,
        duration: opts?.duration ?? (kind === 'loading' ? undefined : 4000),
        createdAt: Date.now(),
      };
      setToasts((prev) => [...prev, toast]);

      if (toast.duration) {
        window.setTimeout(() => dismiss(id), toast.duration);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback((m: string, o?: ToastOptions) => show('success', m, o), [show]);
  const error = useCallback((m: string, o?: ToastOptions) => show('error', m, o), [show]);
  const info = useCallback((m: string, o?: ToastOptions) => show('info', m, o), [show]);
  const warning = useCallback((m: string, o?: ToastOptions) => show('warning', m, o), [show]);
  const loading = useCallback((m: string, o?: ToastOptions) => show('loading', m, o), [show]);

  const promise = useCallback(
    async <T,>(
      p: Promise<T>,
      labels: { loading?: string; success?: string; error?: string },
      opts?: { duration?: number }
    ) => {
      const id = loading(labels.loading ?? 'Chargement…');
      try {
        const res = await p;
        dismiss(id);
        success(labels.success ?? 'Terminé', { duration: opts?.duration ?? 3000 });
        return res;
      } catch (e) {
        dismiss(id);
        error(labels.error ?? "Une erreur est survenue", { duration: opts?.duration ?? 4500 });
        throw e;
      }
    },
    [loading, dismiss, success, error]
  );

  const api = useMemo<ToastAPI>(
    () => ({
      toasts,
      show,
      dismiss,
      success,
      error,
      info,
      warning,
      loading,
      promise,
    }),
    [toasts, show, dismiss, success, error, info, warning, loading, promise]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
