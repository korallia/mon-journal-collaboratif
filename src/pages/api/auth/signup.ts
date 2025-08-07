import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  }

  const { username, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Utilisateur déjà existant.' });
    }

    // Hash du mot de passe
    const hashedPassword = await hash(password, 10);

    // Création de l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: username, // Tu peux le remplacer par un champ réel plus tard
      },
    });

    return res.status(201).json({ message: 'Compte créé avec succès.', userId: newUser.id });
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur :', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
}
