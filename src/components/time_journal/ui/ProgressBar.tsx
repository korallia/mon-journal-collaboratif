'use client';
import React from 'react';

type Props = {
  value: number;
  label?: string;
  /** épaisseur en px */
  height?: number;
  /** couleur du fond (track) */
  track?: string;
  /** couleur de la barre (fill) */
  fill?: string;
};

export default function ProgressBar({
  value,
  label,
  height = 16,                              
  track = '#ffffff',         
  fill = '#4CAF50',                        
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
      {label && (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
    <span style={{ fontSize: 12, opacity: 0.9, color: '#e6edf7' }}>{label}</span>
    <span style={{ fontSize: 18, fontWeight: 800, color: '#e6edf7' }}>{v}%</span>
  </div>
)}
      <div
        style={{
          height,
          background: track,
          borderRadius: 9999,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
        }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        role="progressbar"
      >
        <div
          style={{
            width: `${v}%`,
            height: '100%',
            borderRadius: 9999,
            background: fill,
            transition: 'width .25s ease',
          }}
        />
      </div>
    </div>
  );
}
