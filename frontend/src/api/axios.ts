 

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from '@/services/storage.service';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
     
    const body = response.data as { success?: boolean; data?: unknown; meta?: unknown };
    if (body && typeof body === 'object' && 'success' in body) {
      (response as typeof response & { meta: unknown }).meta = body.meta ?? null;
      response.data = body.data ?? null;
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (navigator.onLine) {
        storageService.clearSession();
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
    return Promise.reject(error);
  },
);

export default api;
