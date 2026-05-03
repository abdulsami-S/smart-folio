import api from './axiosInstance';

export const loginAdmin = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refreshAdminToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
