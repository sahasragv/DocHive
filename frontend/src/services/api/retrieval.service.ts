import api from './api';

export interface RetrievalResult {
  id: string;
  score: number;
  document: string;
  documentId: string;
  chunkIndex: number;
}

export interface RetrievalResponse {
  query: string;
  total: number;
  results: RetrievalResult[];
}

export const searchKnowledge = async (query: string): Promise<RetrievalResponse> => {
  const response = await api.post<RetrievalResponse>('/retrieval/search', { query });
  return response.data;
};
