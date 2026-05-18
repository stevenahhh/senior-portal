import React from 'react';
import { Button } from './ui/button';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <main className="max-w-5xl w-full flex flex-col items-center animate-fade-in">

        {/* 로고 및 헤더 영역 */}
        <div className="mb-12 space-y-6">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <span className="text-6xl" role="img" aria-label="복지 아이콘">🤝</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            우리동네 <span className="text-blue-600">맞춤 복지</span> 찾기
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            우리 모두를 위한 다양한 복지 프로그램과 혜택,<br className="hidden md:block" />
            이제 쉽고 간편하게 찾아보세요.
          </p>
        </div>

        {/* 주요 특징 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16 px-4">
          <FeatureCard
            icon="🔍"
            title="간편한 검색"
            desc="지역과 관심사로 원하는 프로그램을 쉽게 찾아요"
          />
          <FeatureCard
            icon="📅"
            title="맞춤형 정보"
            desc="나에게 꼭 맞는 복지 혜택을 한눈에 확인해요"
          />
          <FeatureCard
            icon="✨"
            title="쉬운 사용"
            desc="복잡한 절차 없이 누구나 쉽게 이용해요"
          />
        </div>

        {/* 시작하기 버튼 영역 */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <Button
            onClick={onEnter}
            className="w-full py-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 font-bold"
            aria-label="서비스 시작하기"
          >
            서비스 시작하기
          </Button>
          <p className="text-gray-500 text-lg">
            별도의 회원가입 없이 바로 이용하실 수 있습니다.
          </p>
        </div>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-50 flex flex-col items-center hover:shadow-xl transition-shadow">
      <div className="text-5xl mb-6 bg-blue-50 w-20 h-20 flex items-center justify-center rounded-full">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 text-lg leading-relaxed word-keep-all">
        {desc}
      </p>
    </div>
  );
}