import api from './axiosInstance';

export const getSkills = async () => {
  const response = await api.get('/skills');
  return response.data;
};

export const createSkill = async (data) => {
  const response = await api.post('/skills', data);
  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await api.put(`/skills/${id}`, data);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};

export const toggleSkillVisibility = async (id) => {
  const response = await api.patch(`/skills/${id}/visibility`);
  return response.data;
};
