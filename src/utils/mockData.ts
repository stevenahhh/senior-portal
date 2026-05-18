// Mock 데이터 생성 유틸리티 - 순천시 실제 데이터 기반 (data.md)

import type {
  WelfareCenter,
  Program,
  ProgramType,
  TargetAudience,
  AccessibilityFlags,
  ProgramSubCategory,
  LifeCycle,
  CenterCategory
} from '../types';

// 프로그램 제목/타입으로 세부 카테고리 자동 매핑
function mapProgramSubCategory(title: string, type: ProgramType): ProgramSubCategory | undefined {
  const titleLower = title.toLowerCase();

  // 운동/신체활동
  if (titleLower.includes('체조') || titleLower.includes('건강체조')) return '건강체조';
  if (titleLower.includes('요가') || titleLower.includes('필라테스')) return '운동';
  if (titleLower.includes('운동') || titleLower.includes('스포츠')) return '운동';
  if (titleLower.includes('재활')) return '재활운동';

  // 심리/정서
  if (titleLower.includes('심리') || titleLower.includes('상담')) return '심리상담';
  if (titleLower.includes('정서') || titleLower.includes('치유')) return '정서지원';
  if (titleLower.includes('스트레스')) return '스트레스관리';
  if (titleLower.includes('인지') || titleLower.includes('치매')) return '인지향상';

  // 상담
  if (titleLower.includes('복지상담')) return '복지상담';
  if (titleLower.includes('취업') || titleLower.includes('고용')) return '취업상담';
  if (titleLower.includes('진로')) return '진로상담';
  if (titleLower.includes('법률')) return '법률상담';
  if (titleLower.includes('가족')) return '가족상담';

  // 교육
  if (titleLower.includes('한글') || titleLower.includes('문해')) return '문해교육';
  if (titleLower.includes('디지털') || titleLower.includes('스마트폰') || titleLower.includes('컴퓨터')) return '디지털교육';
  if (titleLower.includes('기초교육') || titleLower.includes('산수')) return '기초교육';
  if (titleLower.includes('직업') || titleLower.includes('취업')) return '직업교육';
  if (titleLower.includes('자립')) return '자립교육';
  if (titleLower.includes('미술') || titleLower.includes('음악') || titleLower.includes('예술') ||
    titleLower.includes('캘리') || titleLower.includes('마술')) return '예술교육';

  // 돌봄/지원
  if (titleLower.includes('급식') || titleLower.includes('식사')) return '급식지원';
  if (titleLower.includes('배달') || titleLower.includes('반찬')) return '식사배달';
  if (titleLower.includes('주간보호') || titleLower.includes('데이케어')) return '주간보호';
  if (titleLower.includes('의료') || titleLower.includes('건강')) return '의료지원';
  if (titleLower.includes('생활지원') || titleLower.includes('후원')) return '생활지원';

  // 문화/여가
  if (titleLower.includes('동아리')) return '동아리';
  if (titleLower.includes('행사') || titleLower.includes('축제')) return '행사';
  if (titleLower.includes('자원봉사') || titleLower.includes('봉사')) return '자원봉사';
  if (titleLower.includes('여가') || titleLower.includes('나들이') || titleLower.includes('문화')) return '문화여가';

  // 기본 타입 매핑
  if (type === '교육') return '기초교육';
  if (type === '돌봄') return '생활지원';

  return undefined;
}

// 대상자로 생애주기 매핑
function mapLifeCycle(targetAudience: TargetAudience[]): LifeCycle[] {
  const lifecycles: LifeCycle[] = [];

  targetAudience.forEach(target => {
    if (target === '아동') {
      // 아동은 영유아, 아동, 청소년 포함 가능
      if (!lifecycles.includes('아동')) lifecycles.push('아동');
    }
    if (target === '청년') lifecycles.push('청년');
    if (target === '어르신') lifecycles.push('노년');
    if (target === '일반') {
      // 일반은 중장년과 노년 모두 포함
      if (!lifecycles.includes('중장년')) lifecycles.push('중장년');
      if (!lifecycles.includes('노년')) lifecycles.push('노년');
    }
  });

  return lifecycles.length > 0 ? lifecycles : ['중장년']; // 기본값
}

// 프로그램 제목으로 키워드 생성
function generateKeywords(title: string, summary: string): string[] {
  const keywords: string[] = [];
  const text = `${title} ${summary}`.toLowerCase();

  // 주요 키워드 추출
  const keywordMap: Record<string, string[]> = {
    '디지털': ['스마트폰', '컴퓨터', 'IT', '디지털'],
    '한글': ['문해', '읽기', '쓰기', '한글'],
    '체조': ['운동', '건강', '체조', '신체활동'],
    '급식': ['식사', '무료급식', '점심', '배식'],
    '상담': ['심리', '상담', '정서', '치유'],
    '교육': ['배움', '학습', '교육', '수업'],
    '문화': ['여가', '취미', '문화', '활동'],
    '자립': ['자활', '독립', '취업', '일자리'],
  };

  Object.keys(keywordMap).forEach(key => {
    if (text.includes(key)) {
      const words = keywordMap[key];
      if (words) keywords.push(...words);
    }
  });

  // 중복 제거
  return [...new Set(keywords)];
}

// 순천시 실제 지역 좌표
const SUNCHEON_LOCATIONS = [
  { name: '조례동', lat: 34.9506, lng: 127.4872 },
  { name: '덕연동', lat: 34.9542, lng: 127.4895 },
  { name: '석현동', lat: 34.9468, lng: 127.5012 },
  { name: '연향동', lat: 34.9623, lng: 127.5134 },
  { name: '저전동', lat: 34.9382, lng: 127.5087 },
  { name: '왕지동', lat: 34.9745, lng: 127.5023 },
  { name: '남제동', lat: 34.9421, lng: 127.4756 },
  { name: '매곡동', lat: 34.9658, lng: 127.4895 },
  { name: '풍덕동', lat: 34.9802, lng: 127.5145 },
  { name: '해룡면', lat: 34.8956, lng: 127.5234 },
];

// ============== 실제 순천시 사회복지시설 데이터 ==============

// 1. 종합사회복지관
const comprehensiveCenters = [
  {
    name: '순천종합사회복지관',
    location: SUNCHEON_LOCATIONS[0], // 조례동
    description: '순천시 조례동에 위치한 종합사회복지관으로 노인, 지역주민을 위한 다양한 교육 및 복지 프로그램을 제공합니다.',
    programs: [
      { title: '한글산수 교실', type: '교육' as ProgramType, target: ['어르신'], schedule: '주 3회 (월,목,금)', time: '10:00~12:00', free: true },
      { title: '디지털 배움터(스마트폰)', type: '교육' as ProgramType, target: ['어르신', '일반'], schedule: '주 1회 (화)', time: '10:00~12:00', free: true },
      { title: '디지털 배움터(컴퓨터 기초)', type: '교육' as ProgramType, target: ['어르신', '일반'], schedule: '주 1회 (수)', time: '10:00~12:00', free: true },
      { title: '경로식당 무료급식', type: '돌봄' as ProgramType, target: ['어르신'], schedule: '주 5회 (월~금)', time: '11:45~12:30', free: true },
      { title: '사회적동아리(건강체조)', type: '신체' as ProgramType, target: ['어르신'], schedule: '주 1회 (화)', time: '10:00~11:30', free: true },
      { title: '사회적동아리(켈리그라피)', type: '기타' as ProgramType, target: ['어르신'], schedule: '주 1회 (수)', time: '10:00~11:30', free: true },
      { title: '사회적동아리(노래교실)', type: '기타' as ProgramType, target: ['어르신'], schedule: '주 1회 (목)', time: '10:00~12:00', free: true },
      { title: 'GO RESTART(마술교실)', type: '기타' as ProgramType, target: ['어르신'], schedule: '주 1회 (목)', time: '10:00~12:00', free: true },
    ]
  },
  {
    name: '순천조례종합사회복지관',
    location: SUNCHEON_LOCATIONS[0], // 조례동
    description: '순천시 조례동에 위치한 종합사회복지관으로 무료급식, 밑반찬 배달, 교육문화 프로그램 등 지역사회보호 서비스를 제공합니다.',
    programs: [
      // 지역사회보호
      { title: '무료급식', type: '돌봄' as ProgramType, target: ['어르신', '저소득'], schedule: '상시', time: '', free: true },
      { title: '식사배달', type: '돌봄' as ProgramType, target: ['어르신', '저소득'], schedule: '상시', time: '', free: true },
      { title: '밑반찬 배달사업', type: '돌봄' as ProgramType, target: ['장애인', '저소득'], schedule: '주 1회 (목)', time: '', free: true },
      { title: '사랑의 김치나눔', type: '돌봄' as ProgramType, target: ['일반'], schedule: '연 1회', time: '', free: true },
      { title: '후원품 지원', type: '돌봄' as ProgramType, target: ['일반'], schedule: '수시', time: '', free: true },
      { title: '지정결연후원금 지원', type: '돌봄' as ProgramType, target: ['아동', '저소득'], schedule: '월 1회', time: '', free: true },
      { title: '이·미용 서비스', type: '기타' as ProgramType, target: ['일반'], schedule: '월 1회', time: '', free: true },
      { title: '행정업무대행', type: '상담' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '복지상담', type: '상담' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '경로위안생신잔치', type: '기타' as ProgramType, target: ['어르신', '저소득'], schedule: '분기별 1회', time: '', free: true },
      { title: '명절행사', type: '기타' as ProgramType, target: ['일반'], schedule: '설, 정월대보름, 추석, 동짓날', time: '', free: true },
      // 교육문화
      { title: '어버이날행사', type: '기타' as ProgramType, target: ['어르신'], schedule: '어버이날', time: '', free: true },
      { title: '우리글셈교실', type: '교육' as ProgramType, target: ['어르신', '일반'], schedule: '매주 3회(월 수 금)', time: '', free: true },
      { title: '아동영화관람', type: '기타' as ProgramType, target: ['아동'], schedule: '매월 마지막 주 금요일', time: '', free: true },
      { title: '원데이클래스', type: '교육' as ProgramType, target: ['일반'], schedule: '연 16회', time: '', free: true },
      { title: '조례시네마', type: '기타' as ProgramType, target: ['일반'], schedule: '분기별 1회', time: '', free: true },
    ]
  }
];

// 2. 노숙인 시설
const homelessCenters = [
  {
    name: '디딤빌',
    location: SUNCHEON_LOCATIONS[1], // 덕연동
    description: '순천시 덕연동에 위치한 노숙인 재활시설로 입소교육, 건강증진, 자활 및 재활 프로그램을 제공합니다.',
    programs: [
      // 입소교육
      { title: '생활인욕구조사', type: '상담' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '일상생활훈련', type: '교육' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '사회기술훈련', type: '교육' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '생활인상담', type: '상담' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      // 건강증진
      { title: '비만관리프로그램', type: '신체' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '약물증상관리', type: '돌봄' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '의료지원', type: '돌봄' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      // 여가지원
      { title: '시청각자료감상', type: '기타' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '나들이 및 산책', type: '기타' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      // 기능회복
      { title: '건강체조 및 마사지', type: '신체' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '원예', type: '기타' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '음악프로그램', type: '기타' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '미술프로그램', type: '기타' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      // 자활 및 재활
      { title: '직업재활', type: '교육' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '원내재활', type: '돌봄' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '자판기 프로그램', type: '교육' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      // 공통적용 프로그램
      { title: '생일잔치', type: '기타' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '통증완화', type: '돌봄' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '사례관리', type: '상담' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '설맞이행사', type: '기타' as ProgramType, target: ['일반'], schedule: '설날', time: '', free: true },
      { title: '어버이날 기념식 및 경로잔치', type: '기타' as ProgramType, target: ['일반'], schedule: '5월', time: '', free: true },
      { title: '봄철체육대회', type: '신체' as ProgramType, target: ['일반'], schedule: '4월', time: '', free: true },
      { title: '하계수련회', type: '기타' as ProgramType, target: ['일반'], schedule: '여름', time: '', free: true },
      { title: '추석명절행사', type: '기타' as ProgramType, target: ['일반'], schedule: '추석', time: '', free: true },
      { title: '생태체험', type: '기타' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '직업능력개발 탐방', type: '교육' as ProgramType, target: ['일반'], schedule: '상시', time: '', free: true },
      { title: '합동추모제', type: '기타' as ProgramType, target: ['일반'], schedule: '연중', time: '', free: true },
    ]
  }
];

// 3. 정신보건시설
const mentalHealthCenters = [
  {
    name: '인선원',
    location: SUNCHEON_LOCATIONS[2], // 석현동
    description: '순천시 석현동에 위치한 정신요양시설로 요양보호, 사회적응, 여가활동 프로그램을 제공합니다.',
    programs: [
      // 요양보호
      { title: '일상생활지원 및 훈련', type: '돌봄' as ProgramType, target: ['장애인'], schedule: '매일', time: '', free: true },
      { title: '약물증상관리 교육', type: '교육' as ProgramType, target: ['장애인'], schedule: '월 2회', time: '', free: true },
      { title: '건강관리 및 자원교육', type: '교육' as ProgramType, target: ['장애인'], schedule: '월 2회', time: '', free: true },
      { title: '영양교육', type: '교육' as ProgramType, target: ['장애인'], schedule: '월 1회', time: '', free: true },
      { title: '노인인지향상', type: '교육' as ProgramType, target: ['어르신', '장애인'], schedule: '월 3회', time: '', free: true },
      // 사회적응 및 사회복귀
      { title: '심리정서지원(스트레스관리)', type: '상담' as ProgramType, target: ['장애인'], schedule: '월 2회', time: '', free: true },
      { title: '사회활동증진', type: '기타' as ProgramType, target: ['장애인'], schedule: '연 2회', time: '', free: true },
      { title: '작업요법 및 사회복귀훈련', type: '교육' as ProgramType, target: ['장애인'], schedule: '주 5회', time: '', free: true },
      { title: '취업적 후교육', type: '교육' as ProgramType, target: ['장애인'], schedule: '월 2회', time: '', free: true },
      { title: '사회적응 및 사회기술훈련', type: '교육' as ProgramType, target: ['장애인'], schedule: '월 2회', time: '', free: true },
      { title: '지식연계 및 교류', type: '상담' as ProgramType, target: ['장애인'], schedule: '발생시', time: '', free: true },
      // 여가활동
      { title: '창의미술활동', type: '기타' as ProgramType, target: ['장애인'], schedule: '월 2회', time: '', free: true },
      { title: '여가체육', type: '신체' as ProgramType, target: ['장애인'], schedule: '주 1회', time: '', free: true },
      { title: '여가문화증진', type: '기타' as ProgramType, target: ['장애인'], schedule: '월 1회', time: '', free: true },
      { title: '합동 난타', type: '기타' as ProgramType, target: ['장애인'], schedule: '월 2회', time: '', free: true },
      { title: '웃음치유', type: '기타' as ProgramType, target: ['장애인'], schedule: '월 1회', time: '', free: true },
      { title: '여행', type: '기타' as ProgramType, target: ['장애인'], schedule: '연중', time: '', free: true },
      // 원내 행사
      { title: '설명절 희망나눔', type: '기타' as ProgramType, target: ['장애인'], schedule: '설날', time: '', free: true },
      { title: '명랑운동회(생활인 체육대회)', type: '신체' as ProgramType, target: ['장애인'], schedule: '4월', time: '', free: true },
      { title: '어버이날 기념식 및 회갑 칠순잔치', type: '기타' as ProgramType, target: ['장애인'], schedule: '5월', time: '', free: true },
      { title: '나눔숲 힐링체험(자연체험)', type: '기타' as ProgramType, target: ['장애인'], schedule: '9월', time: '', free: true },
      { title: '추석명절 행복나눔', type: '기타' as ProgramType, target: ['장애인'], schedule: '추석', time: '', free: true },
      { title: '마음푸른누리 어울림 한마당', type: '기타' as ProgramType, target: ['장애인'], schedule: '10월', time: '', free: true },
      { title: '송년 감사나눔', type: '기타' as ProgramType, target: ['장애인'], schedule: '12월', time: '', free: true },
    ]
  },
  {
    name: '사랑샘',
    location: SUNCHEON_LOCATIONS[3], // 연향동
    description: '순천시 연향동에 위치한 정신재활시설로 생활지원, 재활지원, 지역사회적응 프로그램을 제공합니다.',
    programs: [
      // 생활·운영지원
      { title: '일상생활적응훈련', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '자립훈련', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '정리정돈훈련', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '식생활훈련', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '개인위생관리', type: '돌봄' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      // 가족지원
      { title: '사례관리', type: '상담' as ProgramType, target: ['장애인', '보호자'], schedule: '상시', time: '', free: true },
      { title: '약물증상관리 교육', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '자치회의', type: '기타' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      // 재활지원
      { title: '금전관리 교육', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '여가 및 동아리 활동', type: '기타' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '취업상담', type: '상담' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '취업전 교육', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '사업체 견학 및 보호작업', type: '교육' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '취업 및 자조모임', type: '기타' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      // 지역사회 적응훈련
      { title: '지역사회 연계활동', type: '기타' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
      { title: '회원 자립주택 연계', type: '상담' as ProgramType, target: ['장애인'], schedule: '상시', time: '', free: true },
    ]
  }
];

// 5. 아동시설
const childCareCenters = [
  {
    name: '순천성신원',
    location: SUNCHEON_LOCATIONS[4], // 저전동
    description: '순천시 저전동에 위치한 아동양육시설로 심리·정서 지원, 치료재활, 자립지원 프로그램을 제공합니다.',
    programs: [
      // 심리·정서 지원
      { title: '아동 상담 / 학교상담', type: '상담' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      { title: '생일 축하 / 졸업축하', type: '기타' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      { title: '심리평가 / 치료 / 언어치료', type: '상담' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      // 치료재활
      { title: '입소·초기적응지원 상담', type: '상담' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      { title: '개인·집단상담', type: '상담' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      // 건강지원
      { title: '보건교육 / 법정교육', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      { title: '건강검진 / 예방접종 / 구충제복용', type: '돌봄' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      // 자립지원
      { title: '경제교육 / 진로상담 / 취업교육(인턴쉽)', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '자립체험관 / 자립준비청년 사후관리', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      // 가족지원
      { title: '집별가족 프로그램 / 원가정 방문 / 명절프로그램', type: '기타' as ProgramType, target: ['아동', '보호자'], schedule: '상시', time: '', free: true },
      // 권리옹호
      { title: '가족회의 / 아동자치회 / 아동인권교육', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      // 기타지원
      { title: '악기교실 / 자조동아리(드론)', type: '기타' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
    ]
  },
  {
    name: '순천SOS어린이마을',
    location: SUNCHEON_LOCATIONS[5], // 왕지동
    description: '순천시 왕지동에 위치한 아동복지시설로 자립지원, 심리지원, 교육지원, 가족기능강화 프로그램을 제공합니다.',
    programs: [
      // 자립지원
      { title: '자립이야기, 표준화 프로그램', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '자립직전 아동중심 자립지원', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '자립 전·후 자립지원', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '경계선지능아동 자립지원', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      // 심리지원
      { title: '도담도담(심리지원) 개인·집단상담', type: '상담' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      // 가족지원
      { title: '가족상담 / 연고자상담 / 양육자교육', type: '상담' as ProgramType, target: ['아동', '보호자'], schedule: '상시', time: '', free: true },
      // 교육지원
      { title: '열린공부방 / 병아리학교 / 기초학습지원', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      { title: '특기적성교육 / 복합놀이문화 / 자연친화활동', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      // 가족기능강화
      { title: '소통나눔 이야기', type: '기타' as ProgramType, target: ['아동', '보호자'], schedule: '상시', time: '', free: true },
    ]
  },
  {
    name: '평화로운집',
    location: SUNCHEON_LOCATIONS[6], // 남제동
    description: '순천시 남제동에 위치한 아동자립지원시설로 자립기술훈련과 심리지원 프로그램을 제공합니다.',
    programs: [
      // 자립지원
      { title: '일상생활기술훈련', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '지역사회자원활용기술', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '자기보호기술훈련', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '돈관리기술', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '진로탐색 및 취업기술', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '사회적기술훈련', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      { title: '자립계획 세우기', type: '상담' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      // 심리지원
      { title: '놀이치료 및 심리상담', type: '상담' as ProgramType, target: ['아동', '청년'], schedule: '상시', time: '', free: true },
      { title: '신규입소아동 초기상담', type: '상담' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
    ]
  }
];

// 6. 기타 복지시설
const otherWelfareCenters = [
  {
    name: '양우내안애 다함께돌봄센터',
    location: SUNCHEON_LOCATIONS[7], // 매곡동
    description: '순천시 매곡동에 위치한 다함께돌봄센터로 아동돌봄 및 특별 프로그램을 제공합니다.',
    programs: [
      { title: '나를 사랑하는 여행(자아존중감 향상)', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      { title: 'AI로봇 교육 및 체험', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
    ]
  },
  {
    name: '주암용오름 다함께돌봄센터',
    location: SUNCHEON_LOCATIONS[8], // 풍덕동
    description: '순천시 풍덕동에 위치한 다함께돌봄센터로 아동돌봄 및 특별 프로그램을 제공합니다.',
    programs: [
      { title: '나를 사랑하는 여행(자아존중감 향상)', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
      { title: 'AI로봇 교육 및 체험', type: '교육' as ProgramType, target: ['아동'], schedule: '상시', time: '', free: true },
    ]
  },
];

// 7. 자활근로사업
const selfSufficiencyCenters = [
  {
    name: '순천지역자활센터',
    location: SUNCHEON_LOCATIONS[9], // 해룡면
    description: '순천시 해룡면에 위치한 자활센터로 시장진입형, 사회서비스형, 인턴형 자활근로 및 사례관리를 제공합니다.',
    programs: [
      // 시장진입형
      { title: '주전부리상회', type: '교육' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: false },
      { title: '흰여울세탁본점·남정점', type: '교육' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: false },
      { title: '미태리', type: '교육' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: false },
      { title: '파랑새', type: '교육' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: false },
      { title: '에코워싱', type: '교육' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: false },
      // 사회서비스형
      { title: '에코런드리', type: '교육' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: false },
      { title: '신석식품Ⅰ·Ⅱ', type: '교육' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: false },
      // 인턴·도우미형
      { title: '자활도우미', type: '교육' as ProgramType, target: ['저소득', '청년'], schedule: '상시', time: '', free: true },
      { title: '청년자립도전', type: '교육' as ProgramType, target: ['청년'], schedule: '상시', time: '', free: true },
      // 사례관리
      { title: '사례관리, 상담지원', type: '상담' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: true },
      { title: '참여자 지원사업', type: '돌봄' as ProgramType, target: ['저소득', '일반'], schedule: '상시', time: '', free: true },
    ]
  }
];

// 유틸리티 함수
function generatePhoneNumber(): string {
  const prefix = '061';
  const middle = Math.floor(Math.random() * 900 + 700);
  const last = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${middle}-${last}`;
}

function addRandomOffset(base: number, maxOffset: number = 0.005): number {
  return base + (Math.random() - 0.5) * maxOffset;
}

// Mock 데이터 생성 함수
export function generateMockCenters(): WelfareCenter[] {
  const centers: WelfareCenter[] = [];
  let centerId = 1;

  // 1. 종합사회복지관
  comprehensiveCenters.forEach((centerData) => {
    if (!centerData.location) return;

    const accessibilityFlags: AccessibilityFlags = {
      elevator: true,
      wheelchairRamp: true,
      wheelchairToilet: true,
      breastfeedingRoom: Math.random() > 0.5,
      signLanguageSupport: Math.random() > 0.6,
      parkingAvailable: true,
      noThreshold: true,
    };

    centers.push({
      id: `center-${centerId++}`,
      name: centerData.name,
      category: '종합사회복지관',
      description: centerData.description,
      phone: generatePhoneNumber(),
      email: `contact@${centerData.name.replace(/\s/g, '').toLowerCase()}.or.kr`,
      address: `전라남도 순천시 ${centerData.location.name} ${Math.floor(Math.random() * 500 + 1)}`,
      location: {
        latitude: addRandomOffset(centerData.location.lat),
        longitude: addRandomOffset(centerData.location.lng),
      },
      openingHours: '평일 09:00-18:00, 토요일 09:00-13:00',
      accessibilityFlags,
      tags: ['종합복지관', '어르신', '교육', '무료급식'],
      status: 'active',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  });

  // 2. 노숙인 시설
  homelessCenters.forEach((centerData) => {
    if (!centerData.location) return;

    const accessibilityFlags: AccessibilityFlags = {
      elevator: true,
      wheelchairRamp: true,
      wheelchairToilet: true,
      breastfeedingRoom: false,
      signLanguageSupport: false,
      parkingAvailable: true,
      noThreshold: true,
    };

    centers.push({
      id: `center-${centerId++}`,
      name: centerData.name,
      category: '노숙인시설',
      description: centerData.description,
      phone: generatePhoneNumber(),
      email: `contact@${centerData.name.replace(/\s/g, '').toLowerCase()}.or.kr`,
      address: `전라남도 순천시 ${centerData.location.name} ${Math.floor(Math.random() * 500 + 1)}`,
      location: {
        latitude: addRandomOffset(centerData.location.lat),
        longitude: addRandomOffset(centerData.location.lng),
      },
      openingHours: '24시간 운영',
      accessibilityFlags,
      tags: ['노숙인', '재활', '자활', '생활지원'],
      status: 'active',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  });

  // 3. 정신보건시설
  mentalHealthCenters.forEach((centerData) => {
    if (!centerData.location) return;

    const accessibilityFlags: AccessibilityFlags = {
      elevator: true,
      wheelchairRamp: true,
      wheelchairToilet: true,
      breastfeedingRoom: false,
      signLanguageSupport: Math.random() > 0.7,
      parkingAvailable: true,
      noThreshold: true,
    };

    centers.push({
      id: `center-${centerId++}`,
      name: centerData.name,
      category: '정신보건시설',
      description: centerData.description,
      phone: generatePhoneNumber(),
      email: `contact@${centerData.name.replace(/\s/g, '').toLowerCase()}.or.kr`,
      address: `전라남도 순천시 ${centerData.location.name} ${Math.floor(Math.random() * 500 + 1)}`,
      location: {
        latitude: addRandomOffset(centerData.location.lat),
        longitude: addRandomOffset(centerData.location.lng),
      },
      openingHours: '24시간 운영',
      accessibilityFlags,
      tags: ['정신건강', '요양', '재활', '장애인'],
      status: 'active',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  });

  // 5. 아동시설
  childCareCenters.forEach((centerData) => {
    if (!centerData.location) return;

    const accessibilityFlags: AccessibilityFlags = {
      elevator: true,
      wheelchairRamp: true,
      wheelchairToilet: true,
      breastfeedingRoom: true,
      signLanguageSupport: false,
      parkingAvailable: true,
      noThreshold: true,
    };

    centers.push({
      id: `center-${centerId++}`,
      name: centerData.name,
      category: '아동시설',
      description: centerData.description,
      phone: generatePhoneNumber(),
      email: `contact@${centerData.name.replace(/\s/g, '').toLowerCase()}.or.kr`,
      address: `전라남도 순천시 ${centerData.location.name} ${Math.floor(Math.random() * 500 + 1)}`,
      location: {
        latitude: addRandomOffset(centerData.location.lat),
        longitude: addRandomOffset(centerData.location.lng),
      },
      openingHours: '24시간 운영',
      accessibilityFlags,
      tags: ['아동', '청년', '자립지원', '심리상담'],
      status: 'active',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  });

  // 6. 기타 복지시설
  otherWelfareCenters.forEach((centerData) => {
    if (!centerData.location) return;

    const accessibilityFlags: AccessibilityFlags = {
      elevator: true,
      wheelchairRamp: true,
      wheelchairToilet: true,
      breastfeedingRoom: true,
      signLanguageSupport: false,
      parkingAvailable: true,
      noThreshold: true,
    };

    centers.push({
      id: `center-${centerId++}`,
      name: centerData.name,
      category: '돌봄센터',
      description: centerData.description,
      phone: generatePhoneNumber(),
      email: `contact@${centerData.name.replace(/\s/g, '').toLowerCase()}.or.kr`,
      address: `전라남도 순천시 ${centerData.location.name} ${Math.floor(Math.random() * 500 + 1)}`,
      location: {
        latitude: addRandomOffset(centerData.location.lat),
        longitude: addRandomOffset(centerData.location.lng),
      },
      openingHours: '평일 09:00-19:00',
      accessibilityFlags,
      tags: ['아동돌봄', '다함께돌봄센터'],
      status: 'active',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  });

  // 7. 자활근로사업
  selfSufficiencyCenters.forEach((centerData) => {
    if (!centerData.location) return;

    const accessibilityFlags: AccessibilityFlags = {
      elevator: true,
      wheelchairRamp: true,
      wheelchairToilet: true,
      breastfeedingRoom: false,
      signLanguageSupport: false,
      parkingAvailable: true,
      noThreshold: true,
    };

    centers.push({
      id: `center-${centerId++}`,
      name: centerData.name,
      category: '자활센터',
      description: centerData.description,
      phone: generatePhoneNumber(),
      email: `contact@${centerData.name.replace(/\s/g, '').toLowerCase()}.or.kr`,
      address: `전라남도 순천시 ${centerData.location.name} ${Math.floor(Math.random() * 500 + 1)}`,
      location: {
        latitude: addRandomOffset(centerData.location.lat),
        longitude: addRandomOffset(centerData.location.lng),
      },
      openingHours: '평일 09:00-18:00',
      accessibilityFlags,
      tags: ['자활', '일자리', '사회서비스', '저소득'],
      status: 'active',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  });

  return centers;
}

export function generateMockPrograms(): Program[] {
  const programs: Program[] = [];
  const centers = generateMockCenters();
  let programId = 1;

  // 1. 종합사회복지관 프로그램
  comprehensiveCenters.forEach((centerData, centerIdx) => {
    const center = centers[centerIdx];
    if (!center) return;

    centerData.programs.forEach((progData) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));

      // 시간 파싱
      let startHour = 10;
      let endHour = 12;
      if (progData.time) {
        const timeMatch = progData.time.match(/(\d+):(\d+)~(\d+):(\d+)/);
        if (timeMatch && timeMatch[1] && timeMatch[3]) {
          startHour = parseInt(timeMatch[1]);
          endHour = parseInt(timeMatch[3]);
        }
      }

      startDate.setHours(startHour, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(endHour, 0, 0, 0);

      // 반복 일정 설정
      const isRecurring = progData.schedule.includes('주') || progData.schedule.includes('매주');
      let rrule = undefined;

      if (isRecurring) {
        const dayMap: Record<string, string> = {
          '월': 'MO', '화': 'TU', '수': 'WE', '목': 'TH', '금': 'FR', '토': 'SA', '일': 'SU'
        };
        const days: string[] = [];

        Object.keys(dayMap).forEach(day => {
          if (progData.schedule.includes(day)) {
            const dayCode = dayMap[day];
            if (dayCode) days.push(dayCode);
          }
        });

        if (days.length > 0) {
          rrule = `FREQ=WEEKLY;BYDAY=${days.join(',')};COUNT=24`;
        }
      }

      const summary = `${center.name}에서 진행하는 ${progData.title} 프로그램입니다. ${progData.schedule} 운영됩니다.`;

      programs.push({
        id: `program-${programId++}`,
        centerId: center.id,
        centerName: center.name,
        title: progData.title,
        summary,
        type: progData.type,
        targetAudience: progData.target as TargetAudience[],
        eligibility: progData.target.includes('어르신') ? '만 60세 이상' :
          progData.target.includes('저소득') ? '기초생활수급자 우선' : '제한 없음',
        cost: {
          free: progData.free,
          amount: progData.free ? 0 : Math.floor(Math.random() * 30000 + 10000),
          discountPolicy: progData.free ? undefined : '기초생활수급자 50% 감면',
        },
        schedule: {
          type: isRecurring ? 'recurring' : 'single',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          rrule,
        },
        capacity: Math.floor(Math.random() * 20 + 15),
        registrationMethod: '전화 신청',
        contact: {
          phone: center.phone,
          email: center.email,
        },
        online: false,
        locationNote: `${Math.floor(Math.random() * 3 + 1)}층 ${['다목적실', '강당', '교육실', '프로그램실'][Math.floor(Math.random() * 4)]}`,
        tags: [progData.title.split('(')[0] || progData.title, progData.schedule.includes('무료') ? '무료' : '유료'],
        accessibilityFlags: ['elevator', 'wheelchair_ramp'],
        status: 'published',
        viewCount: Math.floor(Math.random() * 300 + 50),
        createdAt: new Date(center.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        // 새로운 카테고리 필드들
        centerCategory: center.category,
        subCategory: mapProgramSubCategory(progData.title, progData.type),
        lifeCycle: mapLifeCycle(progData.target as TargetAudience[]),
        keywords: generateKeywords(progData.title, summary),
      });
    });
  });

  // 2. 노숙인 시설 프로그램
  homelessCenters.forEach((centerData, centerIdx) => {
    const center = centers[comprehensiveCenters.length + centerIdx];
    if (!center) return;

    centerData.programs.forEach((progData) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      startDate.setHours(10, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(12, 0, 0, 0);

      const isYearly = progData.schedule.includes('월') || progData.schedule.includes('설') || progData.schedule.includes('추석');
      const summary = `${center.name}에서 진행하는 ${progData.title} 프로그램입니다. ${progData.schedule} 운영됩니다.`;

      programs.push({
        id: `program-${programId++}`,
        centerId: center.id,
        centerName: center.name,
        title: progData.title,
        summary,
        type: progData.type,
        targetAudience: progData.target as TargetAudience[],
        eligibility: '제한 없음',
        cost: {
          free: progData.free,
          amount: 0,
        },
        schedule: {
          type: isYearly ? 'single' : 'recurring',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          rrule: isYearly ? undefined : 'FREQ=WEEKLY;COUNT=48',
        },
        capacity: Math.floor(Math.random() * 15 + 10),
        registrationMethod: '방문 신청',
        contact: {
          phone: center.phone,
          email: center.email,
        },
        online: false,
        locationNote: `${Math.floor(Math.random() * 3 + 1)}층 ${['프로그램실', '강당', '교육실', '휴게실'][Math.floor(Math.random() * 4)]}`,
        tags: [progData.title, '재활', '자활'],
        accessibilityFlags: ['elevator'],
        status: 'published',
        viewCount: Math.floor(Math.random() * 150 + 30),
        createdAt: new Date(center.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        // 새로운 카테고리 필드들
        centerCategory: center.category,
        subCategory: mapProgramSubCategory(progData.title, progData.type),
        lifeCycle: mapLifeCycle(progData.target as TargetAudience[]),
        keywords: generateKeywords(progData.title, summary),
      });
    });
  });

  // 3. 정신보건시설 프로그램
  mentalHealthCenters.forEach((centerData, centerIdx) => {
    const center = centers[comprehensiveCenters.length + homelessCenters.length + centerIdx];
    if (!center) return;

    centerData.programs.forEach((progData) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      startDate.setHours(10, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(12, 0, 0, 0);

      const isRecurring = progData.schedule.includes('주') || progData.schedule.includes('월') || progData.schedule.includes('상시');
      const summary = `${center.name}에서 진행하는 ${progData.title} 프로그램입니다. ${progData.schedule} 운영됩니다.`;

      programs.push({
        id: `program-${programId++}`,
        centerId: center.id,
        centerName: center.name,
        title: progData.title,
        summary,
        type: progData.type,
        targetAudience: progData.target as TargetAudience[],
        eligibility: '등록 장애인',
        cost: {
          free: progData.free,
          amount: 0,
        },
        schedule: {
          type: isRecurring ? 'recurring' : 'single',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          rrule: isRecurring ? 'FREQ=WEEKLY;COUNT=48' : undefined,
        },
        capacity: Math.floor(Math.random() * 15 + 10),
        registrationMethod: '전화 신청',
        contact: {
          phone: center.phone,
          email: center.email,
        },
        online: false,
        locationNote: `${Math.floor(Math.random() * 3 + 1)}층 ${['요양실', '재활실', '프로그램실', '치료실'][Math.floor(Math.random() * 4)]}`,
        tags: [progData.title, '정신건강', '재활'],
        accessibilityFlags: ['elevator', 'wheelchair_toilet'],
        status: 'published',
        viewCount: Math.floor(Math.random() * 200 + 50),
        createdAt: new Date(center.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        // 새로운 카테고리 필드들
        centerCategory: center.category,
        subCategory: mapProgramSubCategory(progData.title, progData.type),
        lifeCycle: mapLifeCycle(progData.target as TargetAudience[]),
        keywords: generateKeywords(progData.title, summary),
      });
    });
  });

  // 5. 아동시설 프로그램
  const childCareStartIdx = comprehensiveCenters.length + homelessCenters.length + mentalHealthCenters.length;
  childCareCenters.forEach((centerData, centerIdx) => {
    const center = centers[childCareStartIdx + centerIdx];
    if (!center) return;

    centerData.programs.forEach((progData) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      startDate.setHours(14, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(16, 0, 0, 0);
      const summary = `${center.name}에서 진행하는 ${progData.title} 프로그램입니다. ${progData.schedule} 운영됩니다.`;

      programs.push({
        id: `program-${programId++}`,
        centerId: center.id,
        centerName: center.name,
        title: progData.title,
        summary,
        type: progData.type,
        targetAudience: progData.target as TargetAudience[],
        eligibility: '보호아동 및 자립준비청년',
        cost: {
          free: progData.free,
          amount: 0,
        },
        schedule: {
          type: 'recurring',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          rrule: 'FREQ=WEEKLY;COUNT=48',
        },
        capacity: Math.floor(Math.random() * 20 + 10),
        registrationMethod: '방문 신청',
        contact: {
          phone: center.phone,
          email: center.email,
        },
        online: false,
        locationNote: `${Math.floor(Math.random() * 2 + 1)}층 ${['상담실', '교육실', '놀이방', '프로그램실'][Math.floor(Math.random() * 4)]}`,
        tags: [progData.title, '아동', '자립'],
        accessibilityFlags: ['elevator', 'wheelchair_ramp'],
        status: 'published',
        viewCount: Math.floor(Math.random() * 180 + 40),
        createdAt: new Date(center.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        // 새로운 카테고리 필드들
        centerCategory: center.category,
        subCategory: mapProgramSubCategory(progData.title, progData.type),
        lifeCycle: mapLifeCycle(progData.target as TargetAudience[]),
        keywords: generateKeywords(progData.title, summary),
      });
    });
  });

  // 6. 기타 복지시설 프로그램
  const otherStartIdx = childCareStartIdx + childCareCenters.length;
  otherWelfareCenters.forEach((centerData, centerIdx) => {
    const center = centers[otherStartIdx + centerIdx];
    if (!center) return;

    centerData.programs.forEach((progData) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      startDate.setHours(15, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(17, 0, 0, 0);
      const summary = `${center.name}에서 진행하는 ${progData.title} 프로그램입니다.`;

      programs.push({
        id: `program-${programId++}`,
        centerId: center.id,
        centerName: center.name,
        title: progData.title,
        summary,
        type: progData.type,
        targetAudience: progData.target as TargetAudience[],
        eligibility: '초등학생',
        cost: {
          free: progData.free,
          amount: 0,
        },
        schedule: {
          type: 'recurring',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=40',
        },
        capacity: Math.floor(Math.random() * 15 + 10),
        registrationMethod: '전화 신청',
        contact: {
          phone: center.phone,
          email: center.email,
        },
        online: false,
        locationNote: '1층 교육실',
        tags: [progData.title, '아동돌봄'],
        accessibilityFlags: ['elevator', 'wheelchair_ramp', 'wheelchair_toilet'],
        status: 'published',
        viewCount: Math.floor(Math.random() * 250 + 80),
        createdAt: new Date(center.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        // 새로운 카테고리 필드들
        centerCategory: center.category,
        subCategory: mapProgramSubCategory(progData.title, progData.type),
        lifeCycle: mapLifeCycle(progData.target as TargetAudience[]),
        keywords: generateKeywords(progData.title, summary),
      });
    });
  });

  // 7. 자활근로사업 프로그램
  const selfStartIdx = otherStartIdx + otherWelfareCenters.length;
  selfSufficiencyCenters.forEach((centerData, centerIdx) => {
    const center = centers[selfStartIdx + centerIdx];
    if (!center) return;

    centerData.programs.forEach((progData) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      startDate.setHours(9, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(18, 0, 0, 0);
      const summary = `${center.name}에서 진행하는 ${progData.title} 프로그램입니다. 자활근로를 통한 경제적 자립을 지원합니다.`;

      programs.push({
        id: `program-${programId++}`,
        centerId: center.id,
        centerName: center.name,
        title: progData.title,
        summary,
        type: progData.type,
        targetAudience: progData.target as TargetAudience[],
        eligibility: '기초생활수급자, 차상위계층',
        cost: {
          free: progData.free,
          amount: progData.free ? 0 : 50000,
          discountPolicy: progData.free ? undefined : '참여자 무료',
        },
        schedule: {
          type: 'recurring',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=52',
        },
        capacity: Math.floor(Math.random() * 10 + 5),
        registrationMethod: '전화 신청',
        contact: {
          phone: center.phone,
          email: center.email,
        },
        online: false,
        locationNote: '사무실',
        tags: [progData.title, '자활', '일자리'],
        accessibilityFlags: ['parking'],
        status: 'published',
        viewCount: Math.floor(Math.random() * 350 + 100),
        createdAt: new Date(center.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        // 새로운 카테고리 필드들
        centerCategory: center.category,
        subCategory: mapProgramSubCategory(progData.title, progData.type),
        lifeCycle: mapLifeCycle(progData.target as TargetAudience[]),
        keywords: generateKeywords(progData.title, summary),
      });
    });
  });

  return programs;
}

// 싱글톤 패턴으로 Mock 데이터 관리
let mockCenters: WelfareCenter[] | null = null;
let mockPrograms: Program[] | null = null;

export function getMockCenters(): WelfareCenter[] {
  if (!mockCenters) {
    mockCenters = generateMockCenters();
  }
  return mockCenters;
}

export function getMockPrograms(): Program[] {
  if (!mockPrograms) {
    mockPrograms = generateMockPrograms();
  }
  return mockPrograms;
}

export function resetMockData() {
  mockCenters = null;
  mockPrograms = null;
}
