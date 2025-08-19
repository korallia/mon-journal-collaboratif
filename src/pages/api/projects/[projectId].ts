// pages/api/projects/[projectId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;
  if (typeof projectId !== 'string') {
    return res.status(400).json({ message: 'Paramètre projectId invalide.' });
  }

  try {
    if (req.method === 'GET') {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) return res.status(404).json({ message: 'Projet introuvable.' });
      return res.status(200).json(project);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { name } = req.body as { name?: string };
      if (!name) return res.status(400).json({ message: 'Le champ name est requis.' });

      const project = await prisma.project.update({
        where: { id: projectId },
        data: { name },
      });
      return res.status(200).json(project);
    }

    if (req.method === 'DELETE') {
      await prisma.project.delete({ where: { id: projectId } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    return res.status(405).json({ message: 'Méthode non autorisée.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}
