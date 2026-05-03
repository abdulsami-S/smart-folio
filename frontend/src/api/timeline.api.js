import api from './axiosInstance';

export const getTimeline = async () => {
  const response = await api.get('/timeline');
  return response.data;
};

export const createTimelineEntry = async (data) => {
  const response = await api.post('/timeline', data);
  return response.data;
};

export const updateTimelineEntry = async (id, data) => {
  const response = await api.put(`/timeline/${id}`, data);
  return response.data;
};

export const deleteTimelineEntry = async (id) => {
  const response = await api.delete(`/timeline/${id}`);
  return response.data;
};

export const reorderTimeline = async (items) => {
  const response = await api.patch('/timeline/reorder', items);
  return response.data;
};
