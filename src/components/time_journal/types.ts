export type ProjectDTO = { id: string; name: string; targetHours?: number };
export type TaskDTO = { id: string; projectId: string; title: string };
export type EntryDTO = {
  id: string;
  taskId: string;
  entryDate: string; // ISO YYYY-MM-DD
  hoursLogged: number;
  notes?: string | null;
  taskName?: string;
  projectId?: string;
   title?: string;            
};