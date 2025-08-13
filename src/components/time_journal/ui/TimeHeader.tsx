'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import st from '../timeStyles';
import ProgressBar from './ProgressBar';

interface Props {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  loadingProjects: boolean;
  hasProjects: boolean;
  currentProjectName?: string;
  errorMsg?: string;
  backHref?: string;
  s: any; // style-kit global existant (boutons, etc.)
  progressValue?: number; // 0..100
}

export default function TimeHeader({ status, loadingProjects, hasProjects, currentProjectName, errorMsg, backHref = '/dashboard', s, progressValue = 0, }: Props) {
  return (
    <div style={st.hero}>
      <div style={st.heroRow}>
        <div style={st.heroLeft}>
          <div style={st.avatar}>⏱</div>
          <div>
            <h1 style={st.heroTitle}>Journal de temps</h1>
            <div style={st.heroSub}>
              {status === 'loading'
                ? 'Connexion…'
                : loadingProjects
                ? 'Chargement des projets…'
                : hasProjects
                ? `Projet : ${currentProjectName || '—'}`
                : 'Aucun projet disponible'}
            </div>
            {errorMsg && <div style={{ ...s.alert, marginTop: 8 }}>{errorMsg}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProgressBar value={progressValue} label="Progression du projet" />
          <a href={backHref} style={s.ghostBtnOnDark}>Retour au tableau</a>
        </div>
      </div>
    </div>
  );
}