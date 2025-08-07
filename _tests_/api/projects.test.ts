// __tests__/api/projects.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/projects' 
import type { NextApiRequest, NextApiResponse } from 'next'

describe('GET /api/projects', () => {
  it('should return 200 and an array', async () => {
    // Simule une requête GET
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    })

    await handler(req, res)

    // status 200
    expect(res._getStatusCode()).toBe(200)

    // body JSON parsé : ici, on s'attend à un tableau (vide ou non)
    const data = JSON.parse(res._getData())
    expect(Array.isArray(data)).toBe(true)
  })
})
