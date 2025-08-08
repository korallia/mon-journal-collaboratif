import { PrismaClient, User } from '@prisma/client'

export interface IUserCreate {
  email: string
  name: string
  password: string
}
export interface IUserUpdate {
  email?: string
  name?: string
  password?: string
}

// Pour ne jamais renvoyer le mot de passe
export type SafeUser = Pick<User, 'id' | 'email' | 'name' | 'createdAt'>

export class UserService {
  // même pattern que ton ProjectService
  private prisma = new PrismaClient()
  // (option plus sûre en Next: utiliser un singleton importé de lib/prisma)

  async list(): Promise<SafeUser[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, createdAt: true },
    })
  }

  async getById(id: string): Promise<SafeUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    })
  }

  async getByEmail(email: string): Promise<SafeUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, createdAt: true },
    })
  }

  async exists(id: string): Promise<boolean> {
    const u = await this.prisma.user.findUnique({ where: { id }, select: { id: true } })
    return !!u
  }

  async create(data: IUserCreate): Promise<SafeUser> {
    return this.prisma.user.create({
      data: { email: data.email, name: data.name, password: data.password },
      select: { id: true, email: true, name: true, createdAt: true },
    })
  }

  async update(id: string, data: IUserUpdate): Promise<SafeUser> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }
}
