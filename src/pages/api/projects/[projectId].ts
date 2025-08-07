import { NextApiRequest, NextApiResponse } from 'next';
import { ProjectService } from '@/services/ProjectService';

const service = new ProjectService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.projectId as string;
  try {
    switch (req.method) {
      case 'GET': {
        const project = await service.getById(id);
        if (!project) return res.status(404).json({ error: 'Non trouvé' });
        return res.status(200).json(project);
      }
      case 'PUT': {
        const { name, description } = req.body;
        const updated = await service.update(id, { name, description });
        return res.status(200).json(updated);
      }
      case 'DELETE':
        await service.delete(id);
        return res.status(204).end();
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
