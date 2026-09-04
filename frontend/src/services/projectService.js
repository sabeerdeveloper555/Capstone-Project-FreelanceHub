import API from './api';

export const getProjects = async () => (await API.get('/projects')).data.projects;
export const createProject = async (project) => (await API.post('/projects', project)).data.project;
export const updateProject = async (id, project) => (await API.put(`/projects/${id}`, project)).data.project;
export const deleteProject = async (id) => API.delete(`/projects/${id}`);
