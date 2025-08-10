// src/app/SessionProviderWrapper.tsx
'use client';
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface SessionProviderWrapperProps {
    children: React.ReactNode;
    session: Session | null;
}

// Déstructurez les props dans la signature de la fonction
export default function SessionProviderWrapper({ children, session }: SessionProviderWrapperProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}