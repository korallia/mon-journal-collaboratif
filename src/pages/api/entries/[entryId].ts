// pages/api/entries/[entryId].ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toNumber(n: any) {
  const x = Number(n);
  return Number.isFinite(x) ? x : undefined;
}

function toDate(d: any) {
  if (!d) return undefined;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ⚠️ après renommage en [entryId].ts, le param s’appelle "entryId"
  const entryId = typeof req.query.entryId === 'string' ? req.query.entryId : undefined;
  if (!entryId) return res.status(400).json({ message: 'entryId invalide' });

  try {
    if (req.method === 'GET') {
      const e = await prisma.entry.findUnique({ where: { id: entryId } });
      if (!e) return res.status(404).json({ message: 'Introuvable' });
      return res.status(200).json(e);
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { taskId, entryDate, hoursLogged, notes, title } = req.body ?? {};

      const data: any = {};
      if (taskId) data.taskId = taskId;

      const dt = toDate(entryDate);
      if (dt) data.entryDate = dt;

      const hrs = toNumber(hoursLogged);
      if (hrs !== undefined) data.hoursLogged = hrs;

      if (notes !== undefined) data.notes = notes ?? null;
      if (title !== undefined) data.title = title ?? null;

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
      }

      const updated = await prisma.entry.update({
        where: { id: entryId },
        data,
      });

      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await prisma.entry.delete({ where: { id: entryId } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err: any) {
    console.error('[entries/[entryId]] error:', err);
    // P2025: not found
    if (err?.code === 'P2025') return res.status(404).json({ message: 'Entrée introuvable' });
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
