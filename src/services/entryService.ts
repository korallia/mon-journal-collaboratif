/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import type { Entry } from '@prisma/client';

/** Payloads */
export interface IEntryCreate {
  taskId: string;
  entryDate: string;    // ISO 'YYYY-MM-DD'
  hoursLogged: number;  // ex. 1.5 pour 1h30
  title?: string | null;
  notes?: string | null;
}

export interface IEntryUpdate {
  entryDate?: string;   // ISO
  hoursLogged?: number;
  title?: string | null;
  notes?: string | null;
}

/** Entry + infos minimales de la tâche (pour taskName / projectId côté front) */
export type EntryWithTask = Entry & {
  task: { id: string; title: string; projectId: string };
};

export class EntryService {
  private prisma = new PrismaClient();

  /** Liste (limite + filtre projet via relation task.projectId) */
  async list(params: { limit?: number; projectId?: string }): Promise<EntryWithTask[]> {
    const { limit = 20, projectId } = params;
    return this.prisma.entry.findMany({
      take: limit,
      orderBy: { entryDate: 'desc' },
      where: projectId ? { task: { projectId } } : {},
      include: { task: { select: { id: true, title: true, projectId: true } } },
    }) as Promise<EntryWithTask[]>;
  }

  /** Lire une entrée */
  async getById(id: string): Promise<EntryWithTask | null> {
    return this.prisma.entry.findUnique({
      where: { id },
      include: { task: { select: { id: true, title: true, projectId: true } } },
    }) as Promise<EntryWithTask | null>;
  }

  /** Créer une entrée */
  async create(data: IEntryCreate): Promise<EntryWithTask> {
    const { taskId, entryDate, hoursLogged, title = null, notes = null } = data;
    return this.prisma.entry.create({
      data: {
        taskId,
        entryDate: new Date(entryDate),
        hoursLogged, // number OK pour un Decimal Prisma
        title,
        notes,
      },
      include: { task: { select: { id: true, title: true, projectId: true } } },
    }) as Promise<EntryWithTask>;
  }

  /** Mettre à jour une entrée */
  async update(
    id: string,
    data: { entryDate?: string; hoursLogged?: number; title?: string | null; notes?: string | null }
  ): Promise<EntryWithTask | null> {
    try {
      return (await this.prisma.entry.update({
        where: { id },
        data: {
          ...(data.entryDate !== undefined ? { entryDate: new Date(data.entryDate) } : {}),
          ...(data.hoursLogged !== undefined ? { hoursLogged: data.hoursLogged } : {}),
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
        },
        include: { task: { select: { id: true, title: true, projectId: true } } },
      })) as EntryWithTask;
    } catch (e: any) {
      if (e?.code === 'P2025') return null; // not found
      throw e;
    }
  }

  /** Supprimer une entrée */
  async delete(id: string): Promise<void> {
    await this.prisma.entry.deleteMany({ where: { id } });
  }
}
