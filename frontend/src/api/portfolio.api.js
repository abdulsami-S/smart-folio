import api from './axiosInstance';

export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const updatePortfolio = async (data) => {
  const response = await api.put('/portfolio', data);
  return response.data;
};
