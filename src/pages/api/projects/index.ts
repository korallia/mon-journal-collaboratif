import type { NextApiRequest, NextApiResponse } from 'next'
import { ProjectService } from '@/services/ProjectService'
import { UserService } from '@/services/UserService'

const projectService = new ProjectService()
const userService = new UserService()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
        const userId = typeof req.query.userId === 'string' ? req.query.userId : ''
        if (!userId) return res.status(400).json({ message: '`userId` est requis.' })
        const projects = await projectService.listByUser(userId)
        return res.status(200).json(projects)
    }
    case 'POST': {
      const { name,  userId } = req.body ?? {}
      if (!name || !userId) {
        return res.status(400).json({ message: 'Le champ `name` et `userId` sont requis.' })
      }

      const ok = await userService.exists(userId)
      if (!ok) return res.status(400).json({ message: 'Utilisateur inexistant.' })

      const created = await projectService.create({ name,  userId })
      return res.status(201).json(created)
    }
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).json({ message: `Méthode ${req.method} non autorisée.` })
  }
}
