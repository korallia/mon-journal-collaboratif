import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { TaskService } from "@/services/TaskServices";

const taskService = new TaskService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const param = req.query.taskId;
  const taskId = Array.isArray(param) ? param[0] : param;
  if (!taskId) return res.status(400).json({ message: "taskId manquant." });

  try {
    switch (req.method) {
      case "GET": {
        const task = await taskService.getById(taskId);
        if (!task) return res.status(404).json({ message: "Tâche introuvable." });
        return res.status(200).json(task);
      }
      case "PUT": {
        const { title, done } = req.body ?? {};
        if (title === undefined && done === undefined) {
          return res.status(400).json({ message: "Aucun champ à mettre à jour." });
        }
        const updated = await taskService.update(taskId, { title, done });
        return res.status(200).json(updated);
      }
      case "DELETE": {
        await taskService.delete(taskId);
        return res.status(204).end();
      }
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ message: `Méthode ${req.method} non autorisée.` });
    }
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Tâche introuvable." });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}
