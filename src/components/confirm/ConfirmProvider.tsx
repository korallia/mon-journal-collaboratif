'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'danger' | 'primary';
};

type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

type Ctx = { confirm: ConfirmFn } | null;

const ConfirmCtx = createContext<Ctx>(null);

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return ctx.confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({
    title: 'Confirmer',
    description: '',
    confirmText: 'OK',
    cancelText: 'Annuler',
    tone: 'primary',
  });

  const confirm = useCallback<ConfirmFn>((options) => {
    setOpts((prev) => ({ ...prev, ...(options ?? {}) }));
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((value: boolean) => {
    setOpen(false);
    if (resolver.current) {
      resolver.current(value);
      resolver.current = null; // IMPORTANT: reset to null (not undefined)
    }
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmCtx.Provider value={value}>
      {children}

      {/* Minimal dialog; replace by your styled dialog if you want */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.35)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 50,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') close(false);
          }}
        >
          <div
            style={{
              background: '#0f172a',
              color: '#e2e8f0',
              borderRadius: 12,
              padding: 16,
              width: 420,
              boxShadow: '0 12px 32px rgba(0,0,0,.35)',
              border: '1px solid rgba(255,255,255,.15)',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 700 }}>
              {opts.title}
            </h3>
            {opts.description && (
              <p style={{ margin: '0 0 16px 0', opacity: 0.85 }}>
                {opts.description}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => close(false)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,.35)',
                  background: '#546E7A',
                  color: '#fff',
                  cursor: 'pointer',
                  height: 40,
                }}
              >
                {opts.cancelText ?? 'Annuler'}
              </button>
              <button
                onClick={() => close(true)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,.35)',
                  background: opts.tone === 'danger' ? '#C62828' : '#4CAF50',
                  color: '#fff',
                  cursor: 'pointer',
                  height: 40,
                }}
              >
                {opts.confirmText ?? 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}
