// 접근성 유틸리티

/**
 * 스킵 링크 컴포넌트 - 키보드 사용자가 메인 콘텐츠로 바로 이동
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
    >
      메인 콘텐츠로 건너뛰기
    </a>
  );
}

/**
 * 화면 리더 전용 텍스트
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/**
 * 포커스 트랩 훅 - 모달/대화상자에서 포커스 유지
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [ref]);
}

/**
 * 라이브 리전 아나운서 - 동적 콘텐츠 변경 알림
 */
export function LiveRegion({ message, role = 'status' }: { message: string; role?: 'status' | 'alert' }) {
  return (
    <div
      role={role}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * 키보드 네비게이션 헬퍼
 */
export const keyboardNavigation = {
  isEnterOrSpace: (e: React.KeyboardEvent) => e.key === 'Enter' || e.key === ' ',
  isEscape: (e: React.KeyboardEvent) => e.key === 'Escape',
  isArrowKey: (e: React.KeyboardEvent) => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key),
};

/**
 * ARIA 라벨 생성기
 */
export function generateAriaLabel(context: {
  name: string;
  type?: string;
  distance?: number;
  status?: string;
}): string {
  const parts = [context.name];

  if (context.type) parts.push(context.type);
  if (context.distance !== undefined) {
    parts.push(
      context.distance < 1000
        ? `거리 ${Math.round(context.distance)}미터`
        : `거리 ${(context.distance / 1000).toFixed(1)}킬로미터`
    );
  }
  if (context.status) parts.push(context.status);

  return parts.join(', ');
}

import React from 'react';
