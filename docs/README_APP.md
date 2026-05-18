# 사회복지 포털 웹앱

내 주변 사회복지관과 복지 프로그램을 쉽게 찾아볼 수 있는 웹 애플리케이션입니다.

## 🚀 기술 스택

- **런타임**: Bun
- **프레임워크**: React 19 + TypeScript
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: shadcn/ui (Radix UI 기반)
- **API 서버**: Bun 네이티브 서버
- **데이터**: Mock 데이터 (복지관 50개, 프로그램 300개)

## 📋 주요 기능

### 1. 위치 기반 검색
- 사용자의 현재 위치를 기반으로 주변 복지관/프로그램 검색
- 반경 설정 (1km, 3km, 5km, 10km)
- 거리 기준 정렬

### 2. 고급 검색 및 필터링
- 키워드 검색 (복지관명, 프로그램명, 태그)
- 초성 검색 지원 (예: "ㅅㅊㅅ" → "순천시")
- 대상 필터 (어르신, 장애인, 아동, 청년 등)
- 프로그램 유형 (신체, 정신, 상담, 교육, 돌봄, 기타)
- 무료/유료 필터
- 온라인 가능 여부

### 3. 복지관 정보
- 상세 주소 및 연락처
- 운영 시간
- 접근성 정보 (엘리베이터, 휠체어 경사로, 장애인 화장실, 수어 통역 등)
- 진행 프로그램 목록

### 4. 프로그램 정보
- 프로그램 일정 (단일/반복)
- 대상 및 참가 조건
- 비용 정보
- 신청 방법
- 온라인/오프라인 여부

### 5. 관리자 대시보드
- 프로그램 CRUD (생성, 수정, 삭제)
- 프로그램 상태 관리 (게시/임시저장)
- 기관 정보 조회

### 6. 접근성 (Accessibility)
- **WCAG 2.1 AA** 기준 준수
- 키보드 네비게이션 완벽 지원
- 스크린 리더 지원 (ARIA labels, roles, live regions)
- Skip to Content 링크
- 고대비 모드 지원
- 모션 감소 지원 (prefers-reduced-motion)
- 최소 44px 터치 타겟
- 자세한 내용: [ACCESSIBILITY.md](./ACCESSIBILITY.md)

## 🛠️ 설치 및 실행

### 필수 요구사항
- [Bun](https://bun.sh/) 설치 필요

### 설치
```bash
cd c:\Users\steve\Desktop\welfare
bun install
```

### 개발 모드 실행

**방법 1: 별도 터미널에서 실행 (권장)**

터미널 1 - API 서버 실행:
```bash
bun server
```

터미널 2 - 프론트엔드 개발 서버:
```bash
bun dev
```

**방법 2: 한 번에 실행 (concurrently 필요)**
```bash
# concurrently 설치
bun add -D concurrently

# 동시 실행
bun run dev:all
```

### 접속
- **프론트엔드**: http://localhost:3000
- **API 서버**: http://localhost:3001

## 📁 프로젝트 구조

```
src/
├── api/
│   └── client.ts          # API 클라이언트
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── CenterCard.tsx     # 복지관 카드
│   ├── ProgramCard.tsx    # 프로그램 카드
│   └── SearchBar.tsx      # 검색 바 & 필터
├── hooks/
│   └── useGeolocation.ts  # 위치 정보 훅
├── types/
│   └── index.ts           # TypeScript 타입 정의
├── utils/
│   ├── mockData.ts        # Mock 데이터 생성
│   └── search.ts          # 검색/필터 로직
├── App.tsx                # 메인 앱 컴포넌트
├── server.ts              # Bun API 서버
└── index.tsx              # 진입점
```

## 🔌 API 엔드포인트

### GET `/api/centers`
복지관 목록 조회

**쿼리 파라미터:**
- `lat`: 위도
- `lng`: 경도
- `radius`: 반경 (미터)
- `query`: 검색어
- `targetAudience`: 대상 (쉼표로 구분)
- `page`: 페이지 번호
- `limit`: 페이지당 결과 수

### GET `/api/centers/:id`
복지관 상세 정보 조회

### GET `/api/programs`
프로그램 목록 조회

**쿼리 파라미터:** (centers와 동일 + 추가)
- `programType`: 프로그램 유형
- `free`: 무료 여부 (true/false)
- `online`: 온라인 가능 여부 (true/false)

### GET `/api/programs/:id`
프로그램 상세 정보 조회

## 📱 반응형 디자인

- 모바일 퍼스트 접근
- Tailwind CSS 브레이크포인트:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## ♿ 접근성

- WAI-ARIA 속성 지원
- 키보드 네비게이션 가능
- 스크린 리더 호환
- 적절한 색상 대비
- 의미있는 HTML 구조

## 📊 Mock 데이터

- **복지관**: 50개 (서울 전역 분산)
- **프로그램**: 300개 (복지관당 평균 6개)
- **데이터 특징**:
  - 실제와 유사한 서울 지역 좌표
  - 다양한 프로그램 유형 및 대상
  - 단일/반복 일정 혼합
  - 무료/유료 프로그램 분포

## 🔄 향후 개발 계획

- [ ] 복지관/프로그램 상세 페이지
- [ ] 지도 뷰 통합 (Leaflet/Mapbox)
- [ ] 기관 관리자 대시보드
- [ ] 프로그램 등록/수정 기능
- [ ] 인증 시스템 (JWT)
- [ ] 실제 DB 연동 (PostgreSQL + PostGIS)
- [ ] 즐겨찾기/관심 목록
- [ ] 프로그램 신청 기능
- [ ] 관리자 콘솔
- [ ] E2E 테스트

## 📄 라이선스

이 프로젝트는 교육 및 데모 목적으로 제작되었습니다.

## 🤝 기여

이슈 제보 및 PR을 환영합니다!
