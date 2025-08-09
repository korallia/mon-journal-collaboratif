import { PrismaClient, Task } from "@prisma/client";

export interface ITaskCreate {
  projectId: string;
  title: string;
}
export interface ITaskUpdate {
  title?: string;
  done?: boolean;
}

export class TaskService {
  private prisma = new PrismaClient();

  async listByProject(projectId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async create(data: ITaskCreate): Promise<Task> {
    const { projectId, title } = data;
    return this.prisma.task.create({ data: { projectId, title } });
  }

  async update(id: string, data: ITaskUpdate): Promise<Task> {
        return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.done  !== undefined ? { done:  data.done  } : {}),
      }
        });
}

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
