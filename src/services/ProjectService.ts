
import { PrismaClient, Project } from '@prisma/client';

export interface IProjectCreate {
  name: string;
  userId: string;
}

export interface IProjectUpdate {
  name?: string;
  description?: string;
}

export class ProjectService {
  private prisma = new PrismaClient();

  /** Récupérer tous les projets d’un utilisateur */
  async listByUser(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Récupérer un projet par son id */
  async getById(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  /** Créer un nouveau projet */
   async create(data: IProjectCreate) {
    const { name, userId } = data
    return this.prisma.project.create({ data: { name, userId } })
  }

  /** Mettre à jour un projet existant */
 async update(id: string, data: IProjectUpdate) {
    const { name } = data
    return this.prisma.project.update({
      where: { id },
      data: { ...(name !== undefined ? { name } : {}) },
    })
  }

  /** Supprimer un projet */
  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
