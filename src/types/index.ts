// 사회복지포털 타입 정의

export type UserRole = 'public' | 'center_admin' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  centerId?: string;
  lastLoginAt?: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface AccessibilityFlags {
  elevator?: boolean;
  wheelchairRamp?: boolean;
  wheelchairToilet?: boolean;
  breastfeedingRoom?: boolean;
  signLanguageSupport?: boolean;
  parkingAvailable?: boolean;
  noThreshold?: boolean;
}

export type CenterCategory = '종합사회복지관' | '노숙인시설' | '정신보건시설' | '아동시설' | '돌봄센터' | '자활센터' | '기타복지시설';

export interface WelfareCenter {
  id: string;
  name: string;
  category: CenterCategory; // 시설 카테고리 추가
  description: string;
  phone: string;
  email: string;
  address: string;
  location: Location;
  openingHours: string;
  accessibilityFlags: AccessibilityFlags;
  tags: string[];
  status: 'active' | 'hidden';
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProgramType = '신체' | '정신' | '상담' | '교육' | '돌봄' | '기타';

export type ProgramSubCategory =
  // 신체
  | '운동' | '건강체조' | '스포츠' | '재활운동'
  // 정신
  | '심리상담' | '정서지원' | '스트레스관리' | '인지향상'
  // 상담
  | '복지상담' | '취업상담' | '진로상담' | '법률상담' | '가족상담'
  // 교육
  | '기초교육' | '디지털교육' | '문해교육' | '직업교육' | '자립교육' | '예술교육'
  // 돌봄
  | '급식지원' | '식사배달' | '주간보호' | '의료지원' | '생활지원'
  // 기타
  | '문화여가' | '동아리' | '행사' | '자원봉사';

export type LifeCycle = '영유아' | '아동' | '청소년' | '청년' | '중장년' | '노년';

export type TargetAudience = '어르신' | '장애인' | '아동' | '청년' | '보호자' | '저소득' | '다문화' | '일반';

export type ProgramStatus = 'draft' | 'published' | 'closed';

export interface ProgramCost {
  free: boolean;
  amount?: number;
  discountPolicy?: string;
}

export interface ProgramSchedule {
  type: 'single' | 'recurring';
  start: string; // ISO 8601
  end: string;
  rrule?: string; // iCalendar RRULE format
}

export interface ProgramContact {
  phone?: string;
  email?: string;
  url?: string;
}

export interface Program {
  id: string;
  centerId: string;
  centerName?: string; // 조인된 데이터
  centerCategory?: CenterCategory; // 시설 카테고리
  title: string;
  summary: string;
  type: ProgramType;
  subCategory?: ProgramSubCategory; // 세부 카테고리 추가
  lifeCycle?: LifeCycle[]; // 생애주기 추가
  targetAudience: TargetAudience[];
  eligibility: string;
  cost: ProgramCost;
  schedule: ProgramSchedule;
  capacity?: number;
  registrationMethod: string;
  contact: ProgramContact;
  online: boolean;
  locationNote?: string;
  tags: string[];
  keywords?: string[]; // 검색 키워드 추가
  accessibilityFlags: string[];
  status: ProgramStatus;
  imageUrl?: string;
  viewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  centerCategory?: CenterCategory[]; // 시설 카테고리 필터 추가
  targetAudience?: TargetAudience[];
  programType?: ProgramType[];
  programSubCategory?: ProgramSubCategory[]; // 세부 카테고리 필터 추가
  lifeCycle?: LifeCycle[]; // 생애주기 필터 추가
  dayOfWeek?: string[];
  timeOfDay?: ('morning' | 'afternoon' | 'evening')[];
  free?: boolean;
  online?: boolean;
  accessibility?: string[];
}

export interface SortOptions {
  by: 'distance' | 'latest' | 'upcoming' | 'popular';
  order?: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  facets?: Record<string, Record<string, number>>;
}

export interface CenterSearchParams extends PaginationParams {
  lat?: number;
  lng?: number;
  radius?: number; // meters
  query?: string;
  filters?: SearchFilters;
  sort?: SortOptions;
}

export interface ProgramSearchParams extends CenterSearchParams { }

export interface CenterWithDistance extends WelfareCenter {
  distance?: number; // meters
}

export interface ProgramWithDistance extends Program {
  distance?: number; // meters
  center?: WelfareCenter;
}
