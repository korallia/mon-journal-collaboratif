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
  const id = req.query.id as string;

  try {
    if (req.method === 'GET') {
      const row = await service.getById(id);
      if (!row) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(toEntryDTO(row));
    }

    if (req.method === 'PATCH') {
      const { entryDate, hoursLogged, title, notes } = req.body || {};
      const updated = await service.update(id, { entryDate, hoursLogged, title, notes });
      return res.status(200).json(toEntryDTO(updated));
    }

    if (req.method === 'DELETE') {
      await service.delete(id);
      return res.status(204).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err: any) {
    console.error('[entries.id] error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
