'use client';
import React from 'react';

type Props = { value: number; label?: string };
export default function ProgressBar({ value, label }: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
      {label && (
        <div style={{ fontSize: 12, opacity: 0.85 }}>
          {label} <strong>{v}%</strong>
        </div>
      )}
      <div style={{ height: 10, background: '#0b1222', borderRadius: 9999, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
        <div style={{ width: `${v}%`, height: '100%', borderRadius: 9999, background: '#4169E1' }} />
      </div>
    </div>
  );
}