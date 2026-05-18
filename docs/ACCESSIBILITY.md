# 접근성 가이드 (Accessibility Guide)

본 사회복지 포털은 **WCAG 2.1 AA** 기준을 준수하여 모든 사용자가 동등하게 접근할 수 있도록 설계되었습니다.

## 🎯 주요 접근성 기능

### 1. 키보드 네비게이션 (Keyboard Navigation)

#### Skip to Content
- **기능**: 페이지 상단의 "Skip to Content" 링크로 메인 콘텐츠로 바로 이동
- **사용법**: 페이지 로드 후 `Tab` 키를 누르면 표시됨
- **키**: `Enter` 또는 `Space`

#### 카드 네비게이션
- **복지관 카드**: `Tab`으로 포커스 → `Enter` 또는 `Space`로 상세 페이지 이동
- **프로그램 카드**: `Tab`으로 포커스 → `Enter` 또는 `Space`로 상세 페이지 이동
- **포커스 링**: 파란색 링(ring-2 ring-blue-500)으로 현재 포커스 위치 표시

#### 필터 및 검색
- **검색 입력**: `Tab`으로 검색 필드 포커스 → 검색어 입력 → `Enter`로 검색 실행
- **필터 버튼**: `Tab`으로 각 필터 토글 버튼 포커스 → `Enter` 또는 `Space`로 선택/해제
- **ARIA 속성**: `aria-pressed` 속성으로 선택 상태 표시

#### 폼 네비게이션
- **로그인 폼**: `Tab`으로 입력 필드 간 이동 → `Enter`로 제출
- **프로그램 폼**: `Tab`으로 모든 입력 필드 접근 가능
- **오류 메시지**: `role="alert"` 및 `aria-live="assertive"`로 즉시 알림

### 2. 스크린 리더 지원 (Screen Reader Support)

#### ARIA Labels
모든 대화형 요소에 명확한 레이블 제공:

```tsx
// 복지관 카드 예시
<div 
  aria-label="순천시복지관, 복지관, 1.2km 떨어짐, 엘리베이터, 주차 가능"
  role="button"
  tabIndex={0}
>
```

#### Live Regions
동적 콘텐츠 변경 시 자동 알림:

```tsx
// 검색 결과 알림
<LiveRegion message="프로그램 45개를 찾았습니다" />
```

#### Semantic HTML
- `role="banner"` - 헤더 영역
- `role="main"` - 메인 콘텐츠
- `role="search"` - 검색 영역
- `role="contentinfo"` - 푸터
- `role="status"` - 로딩 상태
- `role="alert"` - 오류/경고 메시지

#### Screen Reader Only 텍스트
시각적으로 숨겨진 추가 정보:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 3. 시각적 접근성 (Visual Accessibility)

#### Focus Indicators
- **기본**: 파란색 2px 아웃라인 (`ring-2 ring-blue-500`)
- **호버**: 테두리 색상 변경으로 상호작용 가능 요소 표시
- **활성**: 배경색 변경으로 현재 선택 상태 표시

#### 색상 대비
- **텍스트**: 최소 4.5:1 대비율 준수
- **대형 텍스트**: 최소 3:1 대비율
- **상태 표시**: 색상 외에 아이콘/텍스트로 정보 제공

#### 고대비 모드 지원
```css
@media (prefers-contrast: high) {
  .focus-visible\:ring-2:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}
```

### 4. 모션 감소 지원 (Reduced Motion)

애니메이션에 민감한 사용자를 위한 설정:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. 터치 타겟 크기 (Touch Target Size)

모바일 사용성을 위한 최소 터치 영역:

```css
button,
a,
input,
select,
textarea {
  min-height: 44px;
}
```

## 🛠️ 접근성 유틸리티 컴포넌트

### SkipToContent
```tsx
import { SkipToContent } from './utils/accessibility';

<SkipToContent targetId="main-content" />
```

### LiveRegion
```tsx
import { LiveRegion } from './utils/accessibility';

<LiveRegion message={announceMessage} />
```

### VisuallyHidden
```tsx
import { VisuallyHidden } from './utils/accessibility';

<VisuallyHidden>스크린 리더 전용 설명</VisuallyHidden>
```

### useFocusTrap
```tsx
import { useFocusTrap } from './utils/accessibility';

const modalRef = useFocusTrap<HTMLDivElement>(isOpen);
```

## 📋 접근성 체크리스트

### ✅ 완료된 항목

- [x] **키보드 네비게이션**: 모든 대화형 요소에 Tab 접근 가능
- [x] **키보드 작동**: Enter/Space 키로 버튼/링크 활성화
- [x] **포커스 표시**: 명확한 포커스 링 표시
- [x] **Skip Links**: 메인 콘텐츠로 바로 가기 링크
- [x] **ARIA Labels**: 모든 대화형 요소에 설명적 레이블
- [x] **ARIA Roles**: 시맨틱 HTML과 ARIA 역할 적용
- [x] **ARIA Live Regions**: 동적 콘텐츠 변경 알림
- [x] **ARIA States**: aria-pressed, aria-expanded 등 상태 속성
- [x] **Form Labels**: 모든 입력 필드에 연결된 레이블
- [x] **Error Handling**: role="alert"로 오류 메시지 알림
- [x] **Loading States**: role="status"로 로딩 상태 표시
- [x] **Color Contrast**: WCAG AA 기준 색상 대비
- [x] **Touch Targets**: 최소 44px 터치 영역
- [x] **Reduced Motion**: prefers-reduced-motion 지원
- [x] **High Contrast**: 고대비 모드 지원
- [x] **Screen Reader Text**: .sr-only 클래스 활용
- [x] **Semantic HTML**: header, main, nav, footer 등

## 🧪 테스트 방법

### 키보드 테스트
1. 마우스 없이 `Tab` 키만으로 페이지 전체 탐색
2. `Enter`/`Space`로 모든 버튼/링크 활성화 확인
3. `Escape`로 모달/드롭다운 닫기 확인
4. 포커스 순서가 논리적인지 확인

### 스크린 리더 테스트
- **Windows**: NVDA (무료) 또는 JAWS
- **macOS**: VoiceOver (내장)
- **Linux**: Orca

테스트 항목:
1. 모든 대화형 요소가 읽히는지
2. 상태 변경이 알림되는지
3. 이미지 alt 텍스트가 적절한지
4. 폼 레이블이 올바르게 연결되었는지

### 자동화 테스트 도구
- **axe DevTools**: Chrome/Firefox 확장 프로그램
- **WAVE**: 웹 접근성 평가 도구
- **Lighthouse**: Chrome DevTools 내장

## 📱 반응형 디자인

모든 화면 크기에서 접근성 유지:

- **모바일** (< 640px): 단일 열 레이아웃, 큰 터치 타겟
- **태블릿** (640px - 1024px): 2열 그리드 레이아웃
- **데스크톱** (> 1024px): 3열 그리드 레이아웃

## 🔧 추가 개선 사항

향후 추가 예정:
- [ ] 다국어 지원 (i18n)
- [ ] 음성 명령 지원
- [ ] 고대비 테마 토글
- [ ] 글꼴 크기 조정 옵션
- [ ] 자막 지원 (비디오 콘텐츠)

## 📚 참고 자료

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)

## 💬 피드백

접근성 관련 문제나 개선 제안은 이슈로 제출해 주세요!
