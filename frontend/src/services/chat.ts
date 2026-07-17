import api from './api/api';

export const askQuestion = async (question: string) => {
  const { data } = await api.post('/chat', {
    question,
  });

  return data;
};
