import api from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/users/profile');

  return response.data;
};
