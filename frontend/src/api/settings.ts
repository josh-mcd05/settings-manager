import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Setting {
  id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse {
  data: Setting[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const settingsApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse>('/settings', { params: { page, limit } }),
  
  getById: (id: string) =>
    api.get<Setting>(`/settings/${id}`),
  
  create: (data: Record<string, any>) =>
    api.post<Setting>('/settings', { data }),
  
  update: (id: string, data: Record<string, any>) =>
    api.put<Setting>(`/settings/${id}`, { data }),
  
  delete: (id: string) =>
    api.delete(`/settings/${id}`),
};