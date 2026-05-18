// API 유틸리티 함수

import type {
  WelfareCenter,
  Program,
  CenterWithDistance,
  ProgramWithDistance,
  SearchFilters,
  SortOptions,
  PaginatedResponse,
  CenterSearchParams,
  ProgramSearchParams,
} from '../types';

// 두 지점 간의 거리 계산 (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 지구 반경 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위
}

// 텍스트 검색 (간단한 한글 형태소 고려)
export function matchesQuery(text: string, query: string): boolean {
  if (!query) return true;

  const normalizedText = text.toLowerCase().replace(/\s+/g, '');
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '');

  // 완전 일치
  if (normalizedText.includes(normalizedQuery)) return true;

  // 초성 검색 지원 (간단 버전)
  const chosungMap: Record<string, string> = {
    'ㄱ': '[가-깋]', 'ㄴ': '[나-닣]', 'ㄷ': '[다-딯]', 'ㄹ': '[라-맇]',
    'ㅁ': '[마-밓]', 'ㅂ': '[바-빟]', 'ㅅ': '[사-싷]', 'ㅇ': '[아-잏]',
    'ㅊ': '[차-칳]', 'ㅋ': '[카-킿]', 'ㅌ': '[타-팋]', 'ㅍ': '[파-핗]', 'ㅎ': '[하-힣]',
  };

  let pattern = normalizedQuery;
  Object.entries(chosungMap).forEach(([chosung, regex]) => {
    pattern = pattern.replace(new RegExp(chosung, 'g'), regex);
  });

  try {
    return new RegExp(pattern).test(normalizedText);
  } catch {
    return false;
  }
}

// 필터 적용
export function applyFilters<T extends { tags?: string[]; targetAudience?: any[]; type?: any; cost?: any; online?: boolean }>(
  items: T[],
  filters?: SearchFilters
): T[] {
  if (!filters) return items;

  return items.filter(item => {
    // 대상 필터
    if (filters.targetAudience && filters.targetAudience.length > 0) {
      if (!item.targetAudience || !filters.targetAudience.some(t => item.targetAudience?.includes(t))) {
        return false;
      }
    }

    // 프로그램 유형 필터
    if (filters.programType && filters.programType.length > 0) {
      if (!item.type || !filters.programType.includes(item.type)) {
        return false;
      }
    }

    // 무료 필터
    if (filters.free !== undefined) {
      if (!item.cost || item.cost.free !== filters.free) {
        return false;
      }
    }

    // 온라인 필터
    if (filters.online !== undefined) {
      if (item.online !== filters.online) {
        return false;
      }
    }

    return true;
  });
}

// 정렬 적용
export function applySorting<T extends { distance?: number; createdAt?: Date; schedule?: any; viewCount?: number }>(
  items: T[],
  sort?: SortOptions
): T[] {
  if (!sort) return items;

  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sort.by) {
      case 'distance':
        comparison = (a.distance || 0) - (b.distance || 0);
        break;
      case 'latest':
        comparison = (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        break;
      case 'upcoming':
        const aStart = a.schedule ? new Date(a.schedule.start).getTime() : 0;
        const bStart = b.schedule ? new Date(b.schedule.start).getTime() : 0;
        comparison = aStart - bStart;
        break;
      case 'popular':
        comparison = (b.viewCount || 0) - (a.viewCount || 0);
        break;
    }

    return sort.order === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

// 페이지네이션 적용
export function applyPagination<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
): { items: T[]; pageInfo: PaginatedResponse<T>['pageInfo'] } {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    items: items.slice(startIndex, endIndex),
    pageInfo: {
      currentPage,
      totalPages: totalPages || 1,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
}

// 복지관 검색
export function searchCenters(
  centers: WelfareCenter[],
  params: CenterSearchParams
): PaginatedResponse<CenterWithDistance> {
  let results: CenterWithDistance[] = centers.filter(c => c.status === 'active');

  // 거리 계산
  if (params.lat !== undefined && params.lng !== undefined) {
    results = results.map(center => ({
      ...center,
      distance: calculateDistance(
        params.lat!,
        params.lng!,
        center.location.latitude,
        center.location.longitude
      ),
    }));

    // 반경 필터
    if (params.radius) {
      results = results.filter(c => (c.distance || 0) <= params.radius!);
    }
  }

  // 검색어 필터
  if (params.query) {
    results = results.filter(center =>
      matchesQuery(center.name, params.query!) ||
      matchesQuery(center.description, params.query!) ||
      matchesQuery(center.address, params.query!) ||
      center.tags.some(tag => matchesQuery(tag, params.query!))
    );
  }

  // 정렬
  const sorted = applySorting(results, params.sort || { by: 'distance' });

  // 페이지네이션
  const paginated = applyPagination(sorted, params.page, params.limit || 20);

  return {
    ...paginated,
    facets: {},
  };
}

// 프로그램 검색
export function searchPrograms(
  programs: Program[],
  centers: WelfareCenter[],
  params: ProgramSearchParams
): PaginatedResponse<ProgramWithDistance> {
  let results: ProgramWithDistance[] = programs.filter(p => p.status === 'published');

  // 센터 정보와 조인
  const centersMap = new Map(centers.map(c => [c.id, c]));

  // 거리 계산
  if (params.lat !== undefined && params.lng !== undefined) {
    results = results.map(program => {
      const center = centersMap.get(program.centerId);
      const distance = center
        ? calculateDistance(
          params.lat!,
          params.lng!,
          center.location.latitude,
          center.location.longitude
        )
        : undefined;

      return {
        ...program,
        center,
        distance,
      };
    });

    // 반경 필터
    if (params.radius) {
      results = results.filter(p => (p.distance || Infinity) <= params.radius!);
    }
  }

  // 검색어 필터
  if (params.query) {
    results = results.filter(program =>
      matchesQuery(program.title, params.query!) ||
      matchesQuery(program.summary, params.query!) ||
      matchesQuery(program.centerName || '', params.query!) ||
      program.tags.some(tag => matchesQuery(tag, params.query!))
    );
  }

  // 필터 적용
  results = applyFilters(results, params.filters);

  // 정렬
  const sorted = applySorting(results, params.sort || { by: 'distance' });

  // 페이지네이션
  const paginated = applyPagination(sorted, params.page, params.limit || 20);

  // Facets 계산
  const facets = {
    targetAudience: {} as Record<string, number>,
    type: {} as Record<string, number>,
    free: { true: 0, false: 0 },
  };

  results.forEach(program => {
    program.targetAudience?.forEach(t => {
      facets.targetAudience[t] = (facets.targetAudience[t] || 0) + 1;
    });

    if (program.type) {
      facets.type[program.type] = (facets.type[program.type] || 0) + 1;
    }

    if (program.cost?.free) {
      facets.free.true++;
    } else {
      facets.free.false++;
    }
  });

  return {
    ...paginated,
    facets,
  };
}
