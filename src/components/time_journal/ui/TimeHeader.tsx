'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import st from '../timeStyles';
import { headerMobileFix } from '../timeStyles';

interface LastEntry {
  hours: number;
  task: string;
}

interface Props {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  loadingProjects: boolean;
  hasProjects: boolean;
  currentProjectName?: string;
  errorMsg?: string;
  backHref?: string;
  s: any;
  total_time?: string | number;
  lastEntry?: LastEntry | null;
}

export default function TimeHeader({
  status,
  loadingProjects,
  hasProjects,
  currentProjectName,
  errorMsg,
  backHref = '/dashboard',
  s,
  total_time,
  lastEntry,
}: Props) {
 
  return (
    <>
    <style jsx global>{headerMobileFix}</style>
    <div style={st.hero}>
      <div className="heroRow" style={st.heroRow}>
        <div className="heroLeft" style={st.heroLeft}>
          <div style={st.avatar}>⏱</div>

          <div className="LeftBlock" style={st.LeftBlock}>
            <h1 style={st.heroTitle}>Journal de temps</h1>

            <div style={st.heroSub}>
              {status === 'loading'
                ? 'Connexion…'
                : loadingProjects
                ? 'Chargement des projets…'
                : hasProjects
                ? `Temps Total : ${total_time ? total_time : '0h 00'}`
                : 'Aucun projet disponible'}
            </div>

            {errorMsg && <div style={{ ...s.alert, marginTop: 8 }}>{errorMsg}</div>}
          </div>
        </div>

        <div className="centerblock" style={st.centerblock}>
           
  <div style={st.projectName}>{currentProjectName}</div>

  <div className="mobile-separator" style={st.separator} />

  <div
    style={st.lastEntryValue}
    title={lastEntry ? `${lastEntry.hours}h · ${lastEntry.task}` : '—'}
  >
    {lastEntry ? `${lastEntry.hours}h · ${lastEntry.task}` : 'Aucune entrée'}
  </div>
</div>

        <div className="heroRight" style={st.heroRight}>
          <a href={backHref} style={s.ghostBtnOnDark}>
            Retour au tableau
          </a>
        </div>
      </div>
    </div>
    </>
  );
}