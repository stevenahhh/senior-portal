// 데이터 소스 스위치: Mock 데이터 vs 실제 API
// USE_MOCK 또는 VITE_USE_MOCK 환경변수가 'true'이면 Mock 데이터 사용

import { apiClient } from './client';
import type {
  PaginatedResponse,
  CenterWithDistance,
  ProgramWithDistance,
  CenterSearchParams,
  ProgramSearchParams,
  WelfareCenter,
  Program,
} from '../types';
import { getMockCenters, getMockPrograms } from '../utils/mockData';
import { searchCenters, searchPrograms } from '../utils/search';

const useMock = true;

async function getCenters(params: CenterSearchParams = {}): Promise<PaginatedResponse<CenterWithDistance>> {
  if (useMock) {
    const centers = getMockCenters();
    return searchCenters(centers, {
      ...params,
      limit: params.limit ?? 20,
      sort: params.sort ?? { by: 'distance' },
    });
  }
  return apiClient.getCenters(params);
}

async function getPrograms(params: ProgramSearchParams = {}): Promise<PaginatedResponse<ProgramWithDistance>> {
  if (useMock) {
    const centers = getMockCenters();
    const programs = getMockPrograms();
    return searchPrograms(programs, centers, {
      ...params,
      limit: params.limit ?? 20,
      sort: params.sort ?? { by: 'distance' },
    });
  }
  return apiClient.getPrograms(params);
}

async function getCenter(id: string): Promise<WelfareCenter & { programs?: Program[] }> {
  if (useMock) {
    const centers = getMockCenters();
    const center = centers.find(c => c.id === id);
    const programs = getMockPrograms().filter(p => p.centerId === id);
    if (!center) throw new Error('Center not found');
    return { ...center, programs };
  }
  return apiClient.getCenter(id);
}

async function getProgram(id: string): Promise<ProgramWithDistance> {
  if (useMock) {
    const centers = getMockCenters();
    const programs = getMockPrograms();
    const program = programs.find(p => p.id === id);
    if (!program) throw new Error('Program not found');
    const center = centers.find(c => c.id === program.centerId);
    return { ...program, center, distance: undefined } as ProgramWithDistance;
  }
  return apiClient.getProgram(id);
}

export const dataSource = {
  getCenters,
  getPrograms,
  getCenter,
  getProgram,
  useMock,
};
