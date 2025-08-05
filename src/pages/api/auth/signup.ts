import { NextApiRequest, NextApiResponse } from "next";

const mockUsers: { email: string; password: string }[] = [];  // TEMP storage for Sprint 0

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const existingUser = mockUsers.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "Utilisateur déjà existant." });
    }

    mockUsers.push({ email, password });
    console.log("Utilisateurs :", mockUsers);
    return res.status(201).json({ message: "Compte créé avec succès." });
  }

  return res.status(405).json({ message: "Méthode non autorisée." });
}
