/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { EntryService, type EntryWithTask } from '@/services/entryService';

const service = new EntryService();

function toEntryDTO(e: EntryWithTask) {
  return {
    id: e.id,
    taskId: e.taskId,
    entryDate: e.entryDate.toISOString().slice(0, 10),
    hoursLogged: Number(e.hoursLogged),
    notes: e.notes ?? null,
    title: e.title ?? undefined,
    taskName: e.task?.title,
    projectId: e.task?.projectId,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : '';

  if (!id) return res.status(400).json({ error: 'id requis' });

  try {
    if (req.method === 'GET') {
      const row = await service.getById(id);
      if (!row) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(toEntryDTO(row));
    }

    if (req.method === 'PATCH') {
      const { entryDate, hoursLogged, title, notes } = req.body || {};

      // Rien à mettre à jour -> 400
      if (
        entryDate === undefined &&
        hoursLogged === undefined &&
        title === undefined &&
        notes === undefined
      ) {
        return res.status(400).json({ error: 'Aucun champ à mettre à jour.' });
      }

      const updated = await service.update(id, {
        ...(entryDate !== undefined ? { entryDate: String(entryDate) } : {}),
        ...(hoursLogged !== undefined ? { hoursLogged: Number(hoursLogged) } : {}),
        ...(title !== undefined ? { title: title ?? null } : {}),
        ...(notes !== undefined ? { notes: notes ?? null } : {}),
      });

      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(toEntryDTO(updated));
    }

    if (req.method === 'DELETE') {
      await service.delete(id);
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    // Prisma “record to update not found”
    if (e?.code === 'P2025') return res.status(404).json({ error: 'Not found' });
    // Entrée invalide (ex. mauvaise date)
    if (e?.name === 'PrismaClientValidationError') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    console.error('[entries.id] error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
