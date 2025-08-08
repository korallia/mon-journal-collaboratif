import type { NextApiRequest, NextApiResponse } from 'next'
import { ProjectService } from '@/services/ProjectService'
const projectService = new ProjectService()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: `Méthode ${req.method} non autorisée.` })
  }
  const userId = String(req.query.userId)
  const projects = await projectService.listByUser(userId)
  return res.status(200).json(projects)
}
