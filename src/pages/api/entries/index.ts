/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from 'next';
// Ajuste l'import selon ton alias TS. Si tu n'as pas `baseUrl: "src"`, fais un import relatif:
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
  try {
    if (req.method === 'GET') {
      const limit = Number(req.query.limit ?? 20);
      const projectId = typeof req.query.projectId === 'string' ? req.query.projectId : undefined;
      const rows = await service.list({ limit: Number.isFinite(limit) ? limit : 20, projectId });
      return res.status(200).json(rows.map(toEntryDTO));
    }

    if (req.method === 'POST') {
      const { taskId, entryDate, hoursLogged, notes, title } = req.body || {};
      if (!taskId || !entryDate || typeof hoursLogged !== 'number') {
        return res
          .status(400)
          .json({ error: 'taskId, entryDate et hoursLogged sont requis.' });
      }
      const created = await service.create({ taskId, entryDate, hoursLogged, notes, title });
      return res.status(201).json(toEntryDTO(created));
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err: any) {
    console.error('[entries.index] error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
