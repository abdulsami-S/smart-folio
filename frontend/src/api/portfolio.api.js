import api from './axiosInstance';

export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const updatePortfolio = async (data) => {
  const response = await api.put('/portfolio', data);
  return response.data;
};

export const uploadImage = async (formData) => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
