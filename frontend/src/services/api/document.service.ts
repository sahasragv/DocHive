import api from './api';
import type { Document } from '../../types/document';

export const uploadDocument = async (
  file: File,
) => {
  const formData = new FormData();

  formData.append('file', file);

  const response = await api.post(
    '/documents/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const getDocuments = async (): Promise<Document[]> => {
  const response = await api.get<Document[]>('/documents');

  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};
