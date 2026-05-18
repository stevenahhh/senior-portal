# 데이터 교체 가이드 (Mock ↔ Real)

이 프로젝트는 데이터 소스를 "Mock 데이터"와 "실제 API" 중에서 손쉽게 전환할 수 있도록 설계되었습니다. 코드 수정 없이 환경변수로만 전환 가능합니다.

## 구조 요약

- 데이터 진입점: `src/api/dataSource.ts`
  - Mock 모드: `src/utils/mockData.ts` + `src/utils/search.ts`로 페이징/필터/정렬 처리
  - Real 모드: `src/api/client.ts`를 통해 서버 API 호출
- UI: `src/App.tsx`는 항상 `dataSource`만 호출하므로 전환 시 UI 변경 없음

## 전환 방법 (Windows PowerShell)

- Mock 모드로 실행

```powershell
$env:USE_MOCK="true"; bun run dev
```

- 실데이터 모드로 실행

```powershell
Remove-Item Env:USE_MOCK -ErrorAction SilentlyContinue; Remove-Item Env:VITE_USE_MOCK -ErrorAction SilentlyContinue; bun run dev
```

참고: `USE_MOCK=true` 또는 `VITE_USE_MOCK=true` 둘 중 하나만 설정되어도 Mock 모드가 켜집니다.

## 동작 확인 체크리스트

- 상단 결과 카운트: "총 N개 결과"가 표시되는지
- 스크롤 하단 도달 시 추가 데이터가 로드되는지 (무한 스크롤)
- 거리/검색/필터 변경 시 목록이 초기화되고 다시 로드되는지
- Mock 모드에서는 네트워크 요청 없이 빠르게 응답되는지
- Real 모드에서는 브라우저 네트워크 탭에 API 요청이 보이는지

## 자주 하는 변경

- Mock 데이터 개수 조정: `src/utils/mockData.ts`
  - 센터 수: `generateMockCenters(50)`의 숫자를 조정
  - 센터당 프로그램 수: `generateMockPrograms(centers, 6)`의 두 번째 인자를 조정

- 정렬/필터 로직 변경: `src/utils/search.ts`
  - 거리/최신/다가오는/인기 정렬 로직
  - 무료/온라인/대상/유형 필터 로직

## 문제 해결

- 전환이 안 되는 경우
  - `.env` 또는 환경변수 값 확인 (`USE_MOCK`, `VITE_USE_MOCK`)
  - `src/api/dataSource.ts`의 `useMock` 값을 `console.log`로 출력해 런타임 값을 확인
- 실데이터 호출 실패
  - 개발 서버(API)가 실행 중인지 확인
  - `src/api/client.ts`의 `API_BASE_URL` 확인 (기본: `http://localhost:3001/api`)

## 참고

- 시니어 UI 문서: `SENIOR_UI_COMPLETE.md`
- 메인 앱: `src/App.tsx`
- 데이터 타입: `src/types/index.ts`
- API 클라이언트: `src/api/client.ts`
- Mock 데이터 생성: `src/utils/mockData.ts`
- 검색/필터/페이지네이션: `src/utils/search.ts`

필요하시면 실데이터용 인증/토큰, 캐싱 레이어(예: React Query), Prefetch 등도 확장해 드릴 수 있어요.
