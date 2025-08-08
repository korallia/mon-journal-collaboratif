import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { ProjectService } from '@/services/ProjectService'

const projectService = new ProjectService()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // projectId peut être string | string[] | undefined
  const projectIdParam = req.query.projectId
  const projectId = Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam
  if (!projectId) return res.status(400).json({ message: 'projectId manquant.' })

  try {
    switch (req.method) {
      case 'GET': {
        const project = await projectService.getById(projectId)
        if (!project) return res.status(404).json({ message: 'Projet introuvable.' })
        return res.status(200).json(project)
      }
      case 'PUT': {
        const { name, description } = req.body ?? {}
        if (name === undefined && description === undefined) {
          return res.status(400).json({ message: 'Aucun champ à mettre à jour.' })
        }
        const updated = await projectService.update(projectId, { name, description })
        return res.status(200).json(updated)
      }
      case 'DELETE': {
        await projectService.delete(projectId)
        return res.status(204).end()
      }
      default: {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ message: `Méthode ${req.method} non autorisée.` })
      }
    }
  } catch (err: unknown) {
    // ↓ raffine le type
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // delete/update sur id inexistant => P2025
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Projet introuvable.' })
      }
      // autres erreurs Prisma connues
      return res.status(400).json({ message: err.message })
    }
    if (err instanceof Error) {
      console.error(err)
      return res.status(500).json({ message: err.message })
    }
    console.error(err)
    return res.status(500).json({ message: 'Erreur serveur.' })
  }
}
