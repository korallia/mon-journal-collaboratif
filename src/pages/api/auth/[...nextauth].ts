// src/pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
// Importez l'objet authOptions que vous avez exporté du fichier central
import { authOptions } from "@/lib/auth";

// Ceci est le SEUL export default dans ce fichier
export default NextAuth(authOptions);