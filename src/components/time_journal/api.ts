const API = {
  projectsByUser: (userId: string) => `/api/projects?userId=${encodeURIComponent(userId)}`,
  tasksByProject: (projectId: string) => `/api/tasks?projectId=${projectId}`,
  entries: {
    list: (limit = 20, projectId?: string) =>
      `/api/entries?limit=${limit}${projectId ? `&projectId=${projectId}` : ''}`,
    create: '/api/entries',
    byId: (id: string) => `/api/entries/${id}`,
  },
};
export default API;