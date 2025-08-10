// src/lib/auth.ts
import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from "next-auth"; // C'est "NextAuthOptions", pas "AuthOptions"
import CredentialsProvider from "next-auth/providers/credentials";

import { compare } from "bcryptjs";

const prisma = new PrismaClient();

// Exportez la constante qui contient toute la configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email ou nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials ?? {};

        if (!identifier || !password) {
          throw new Error("Identifiants manquants.");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { name: identifier }],
          },
        });

        if (!user) {
          throw new Error("Utilisateur non trouvé");
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as {
        id: string;
        name?: string | null;
        email?: string | null;
      };
      return session;
    },
  },
};