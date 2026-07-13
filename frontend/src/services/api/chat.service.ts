import api from './api';

export const askQuestion = async (
  question: string,
) => {
  const response = await api.post('/chat', {
    question,
  });

  return response.data;
};