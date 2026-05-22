import api from './axiosInstance';

export const getProjects = async (isAdmin) => {
  const response = await api.get(`/projects${isAdmin ? '?admin=true' : ''}`);
  return response.data;
};

export const createProject = async (data) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const reorderProjects = async (items) => {
  const response = await api.patch('/projects/reorder', items);
  return response.data;
};

export const toggleProjectVisibility = async (id) => {
  const response = await api.patch(`/projects/${id}/visibility`);
  return response.data;
};
