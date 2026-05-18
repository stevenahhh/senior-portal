# 사회복지 포털 - 빠른 시작 가이드

## 🎯 현재 상태

✅ **완료된 기능:**
1. TypeScript 타입 시스템 구축
2. Mock 데이터 생성 (복지관 50개, 프로그램 300개)
3. Bun 기반 REST API 서버
4. 위치 기반 검색 & 필터링
5. 반응형 UI (React + Tailwind CSS)
6. 복지관/프로그램 카드 컴포넌트
7. 페이지네이션
8. 거리 계산 (Haversine)

## 🚀 실행 방법

### 1단계: API 서버 실행

첫 번째 터미널을 열고:

```powershell
cd c:\Users\steve\Desktop\welfare
bun server
```

출력 예시:
```
🚀 API Server running at http://localhost:3001
📍 Endpoints:
   GET /api/centers
   GET /api/centers/:id
   GET /api/programs
   GET /api/programs/:id
```

### 2단계: 프론트엔드 개발 서버 실행

두 번째 터미널을 열고:

```powershell
cd c:\Users\steve\Desktop\welfare
bun dev
```

출력 예시:
```
$ bun --hot src/index.tsx
Listening on http://localhost:3000
```

### 3단계: 브라우저에서 확인

http://localhost:3000 으로 접속

## 🧪 테스트 시나리오

### 기본 기능 테스트

1. **위치 권한 허용**
   - 브라우저에서 위치 권한 허용
   - 현재 위치 기준으로 데이터 로드 확인

2. **반경 변경**
   - 1km, 3km, 5km, 10km 버튼 클릭
   - 결과 수 변화 확인

3. **뷰 모드 전환**
   - "프로그램 찾기" / "복지관 찾기" 전환
   - 각 카드 스타일 확인

4. **검색 기능**
   - 검색어 입력: "스트레칭", "요가", "상담" 등
   - 결과 필터링 확인

5. **필터 기능**
   - "필터" 버튼 클릭
   - 대상 선택: "어르신", "장애인" 등
   - 프로그램 유형 선택
   - "무료 프로그램만" 체크
   - "필터 적용" 클릭

6. **페이지네이션**
   - "다음" / "이전" 버튼으로 페이지 이동
   - 페이지 번호 확인

## 🔍 API 직접 테스트

### PowerShell에서 테스트

```powershell
# 복지관 목록 조회 (서울시청 기준 5km)
curl "http://localhost:3001/api/centers?lat=37.5665&lng=126.9780&radius=5000"

# 프로그램 검색 (무료, 어르신 대상)
curl "http://localhost:3001/api/programs?lat=37.5665&lng=126.9780&radius=5000&free=true&targetAudience=어르신"

# 특정 복지관 상세
curl "http://localhost:3001/api/centers/center-1"

# 특정 프로그램 상세
curl "http://localhost:3001/api/programs/program-1"
```

## 📊 Mock 데이터 확인

서울 주요 지역에 분산된 복지관:
- 강남구, 서초구, 송파구, 강동구
- 마포구, 용산구, 성동구, 광진구
- 동대문구, 중랑구, 성북구, 강북구
- 도봉구, 노원구, 은평구, 서대문구
- 종로구, 중구, 영등포구, 구로구

프로그램 유형:
- 신체: 낙상 예방, 요가, 댄스 등
- 정신: 우울증 상담, 명상, 인지력 향상
- 교육: 가족 돌봄, 디지털 문해력, 요리
- 돌봄: 주간보호 서비스
- 기타: 미술/음악/원예 치료
- 상담: 사회적응, 취업 상담

## 🎨 UI 컴포넌트

현재 사용 가능한 컴포넌트:
- `<CenterCard>`: 복지관 정보 카드
- `<ProgramCard>`: 프로그램 정보 카드
- `<SearchBar>`: 검색 + 필터 UI
- `<Button>`: 버튼 (shadcn/ui)
- `<Input>`: 입력 필드
- `<Label>`: 레이블
- `<Card>`: 카드 컨테이너

## 🐛 문제 해결

### API 서버가 시작되지 않음
```powershell
# 포트 3001이 사용 중인지 확인
netstat -ano | findstr :3001

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F
```

### 프론트엔드 빌드 오류
```powershell
# node_modules 재설치
rm -rf node_modules
bun install
```

### 위치 정보를 가져올 수 없음
- HTTPS가 아닌 경우 위치 권한이 제한될 수 있음
- 기본 위치(서울시청)로 자동 전환됨
- 브라우저 설정에서 위치 권한 확인

## 📝 다음 단계

추가 개발이 필요한 기능:

1. **상세 페이지**
   - 복지관 상세 정보 페이지
   - 프로그램 상세 정보 페이지
   - 라우팅 추가 (React Router)

2. **지도 통합**
   - Leaflet 또는 Mapbox GL 추가
   - 마커 클릭 → 상세 정보
   - 지도-리스트 동기화

3. **기관 관리자 기능**
   - 로그인/인증
   - 프로그램 등록 폼
   - 프로그램 수정/삭제
   - 기관 정보 관리

4. **고급 검색**
   - 요일별 필터
   - 시간대 필터
   - 접근성 요구사항 필터

5. **성능 최적화**
   - 가상 스크롤
   - 이미지 lazy loading
   - API 응답 캐싱

## 💡 팁

- **개발 중 핫 리로드**: 코드 수정 시 자동으로 반영됨
- **Mock 데이터 재생성**: 서버 재시작 시 새로운 데이터 생성
- **반응형 테스트**: 브라우저 개발자 도구에서 모바일 뷰 확인
- **접근성 테스트**: 키보드만으로 네비게이션 가능한지 확인

## 🎉 축하합니다!

사회복지 포털의 핵심 기능이 구현되었습니다!
이제 브라우저에서 직접 확인해보세요.
