import type { NextApiRequest, NextApiResponse } from "next";
import { TaskService } from "@/services/TaskServices";
import { ProjectService } from "@/services/ProjectService";

const taskService = new TaskService();
const projectService = new ProjectService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const q = req.query.projectId;
        const projectId = Array.isArray(q) ? q[0] : q;
        if (!projectId) return res.status(400).json({ message: "`projectId` est requis." });
        const tasks = await taskService.listByProject(projectId);
        return res.status(200).json(tasks);
      }
      case "POST": {
        const { projectId, title } = req.body ?? {};
        if (!projectId || !title) {
          return res.status(400).json({ message: "`projectId` et `title` sont requis." });
        }
        const project = await projectService.getById(projectId);
        if (!project) return res.status(400).json({ message: "Projet inexistant." });

        const created = await taskService.create({ projectId, title });
        return res.status(201).json(created);
      }
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: `Méthode ${req.method} non autorisée.` });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}
