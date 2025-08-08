/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'

// ⬇️ Adapte les imports si tu n'utilises pas les alias @/
import projectsIndexHandler from '@/pages/api/projects'                  // /pages/api/projects/index.ts
import projectIdHandler from '@/pages/api/projects/[projectId]'         // /pages/api/projects/[projectId].ts

type ErrorBody = { message: string }

describe('Projects API – erreurs (cas négatifs)', () => {
  const unknownProjectId = `nonexistent-${Date.now()}`
  const unknownUserId = `user-${Date.now()}`

  it('GET /api/projects sans userId -> 400', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      // pas de query.userId
    })
    await projectsIndexHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const body = JSON.parse(res._getData()) as ErrorBody
    expect(body.message.toLowerCase()).toContain('userid')
  })

  it('GET /api/projects/[projectId] inconnu -> 404', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { projectId: unknownProjectId },
    })
    await projectIdHandler(req, res)

    expect(res._getStatusCode()).toBe(404)
    const body = JSON.parse(res._getData()) as ErrorBody
    expect(body.message.toLowerCase()).toContain('introuvable')
  })

  it('POST /api/projects sans name -> 400', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { userId: unknownUserId }, // name manquant
    })
    await projectsIndexHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('POST /api/projects sans userId -> 400', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { name: 'X' }, // userId manquant
    })
    await projectsIndexHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('POST /api/projects avec user inexistant -> 400', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { name: 'X', userId: unknownUserId },
    })
    await projectsIndexHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const body = JSON.parse(res._getData()) as ErrorBody
    // ton message est "Utilisateur inexistant." d’après la route
    expect(body.message.toLowerCase()).toContain('utilisateur')
  })

  it('PUT /api/projects/[projectId] sans champs -> 400', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      query: { projectId: unknownProjectId },
      body: {}, // rien à mettre à jour
    })
    await projectIdHandler(req, res)

    expect(res._getStatusCode()).toBe(400)
  })

  it('PUT /api/projects/[projectId] inconnu -> 404', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      query: { projectId: unknownProjectId },
      body: { name: 'Nouvel intitulé' }, // valide mais id inexistant
    })
    await projectIdHandler(req, res)

    expect(res._getStatusCode()).toBe(404)
  })

  it('DELETE /api/projects/[projectId] inconnu -> 404', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { projectId: unknownProjectId },
    })
    await projectIdHandler(req, res)

    expect(res._getStatusCode()).toBe(404)
  })

  it('PATCH /api/projects -> 405 (méthode non autorisée)', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PATCH',
    })
    await projectsIndexHandler(req, res)

    expect(res._getStatusCode()).toBe(405)
  })

  it('POST /api/projects/[projectId] -> 405 (méthode non autorisée)', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      query: { projectId: unknownProjectId },
    })
    await projectIdHandler(req, res)

    expect(res._getStatusCode()).toBe(405)
  })
})
