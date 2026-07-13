import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const login = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);

  return response.data;
};

export const register = async (
  data: LoginRequest,
) => {
  const response = await api.post('/auth/register', data);

  return response.data;
};