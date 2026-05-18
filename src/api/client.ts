// API 클라이언트

import type {
  PaginatedResponse,
  CenterWithDistance,
  ProgramWithDistance,
  CenterSearchParams,
  ProgramSearchParams,
  WelfareCenter,
  Program,
} from '../types';

const API_BASE_URL = typeof process !== 'undefined' && process.env?.VITE_API_URL
  ? process.env.VITE_API_URL
  : 'http://localhost:3001/api';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.set(key, value.join(','));
        } else if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue !== undefined && subValue !== null) {
              queryParams.set(subKey, String(subValue));
            }
          });
        } else {
          queryParams.set(key, String(value));
        }
      }
    });

    const str = queryParams.toString();
    return str ? `?${str}` : '';
  }

  async getCenters(params: CenterSearchParams = {}): Promise<PaginatedResponse<CenterWithDistance>> {
    const query = this.buildQueryString(params);
    return this.request<PaginatedResponse<CenterWithDistance>>(`/centers${query}`);
  }

  async getCenter(id: string): Promise<WelfareCenter & { programs?: Program[] }> {
    return this.request<WelfareCenter & { programs?: Program[] }>(`/centers/${id}`);
  }

  async getPrograms(params: ProgramSearchParams = {}): Promise<PaginatedResponse<ProgramWithDistance>> {
    const query = this.buildQueryString(params);
    return this.request<PaginatedResponse<ProgramWithDistance>>(`/programs${query}`);
  }

  async getProgram(id: string): Promise<ProgramWithDistance> {
    return this.request<ProgramWithDistance>(`/programs/${id}`);
  }
}

export const apiClient = new ApiClient();
