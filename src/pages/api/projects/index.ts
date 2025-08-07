import { NextApiRequest, NextApiResponse } from 'next';
import { ProjectService } from '@/services/ProjectService';

const service = new ProjectService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const userId = req.query.userId as string;
        const list = await service.listByUser(userId);
        return res.status(200).json(list);
      }
      case 'POST': {
        const { name, description, userId } = req.body;
        const created = await service.create({ name, description, userId });
        return res.status(201).json(created);
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
