import { useState, useEffect } from 'react';
import type { WelfareCenter, Program } from '../types';
import { apiClient } from '../api/client';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CenterDetailProps {
  centerId: string;
  onBack: () => void;
}

export function CenterDetail({ centerId, onBack }: CenterDetailProps) {
  const [center, setCenter] = useState<WelfareCenter & { programs?: Program[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCenter();
  }, [centerId]);

  const loadCenter = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getCenter(centerId);
      setCenter(data);
    } catch (err) {
      setError('복지관 정보를 불러올 수 없습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="text-center py-12" role="alert" aria-live="assertive">
        <p className="text-red-600 mb-4">{error || '복지관을 찾을 수 없습니다.'}</p>
        <Button onClick={onBack} variant="outline">돌아가기</Button>
      </div>
    );
  }

  const accessibilityItems = [
    { key: 'elevator', label: '엘리베이터', icon: '🛗' },
    { key: 'wheelchairRamp', label: '휠체어 경사로', icon: '♿' },
    { key: 'wheelchairToilet', label: '장애인 화장실', icon: '🚻' },
    { key: 'breastfeedingRoom', label: '수유실', icon: '🍼' },
    { key: 'signLanguageSupport', label: '수어 통역', icon: '🤟' },
    { key: 'parkingAvailable', label: '주차 가능', icon: '🅿️' },
    { key: 'noThreshold', label: '문턱 없음', icon: '🚪' },
  ];

  const availableAccessibility = accessibilityItems.filter(
    item => center.accessibilityFlags[item.key as keyof typeof center.accessibilityFlags]
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          aria-label="복지관 목록으로 돌아가기"
          className="w-full rounded-xl h-12 text-base font-semibold bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700"
        >
          ← 목록으로 돌아가기
        </Button>
      </div>

      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{center.name}</h1>
            <div className="flex flex-wrap gap-2">
              {center.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{center.description}</p>
        </div>
      </Card>

      {/* Contact & Location Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">연락처 정보</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-700">주소</p>
                <p className="text-gray-600">{center.address}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ({center.location.latitude.toFixed(6)}, {center.location.longitude.toFixed(6)})
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="font-medium text-gray-700">전화번호</p>
                <p className="text-gray-600">{center.phone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-700">이메일</p>
                <p className="text-gray-600">{center.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-5 h-5 mr-3 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-700">운영 시간</p>
                <p className="text-gray-600">{center.openingHours}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">접근성 정보</h2>
          {availableAccessibility.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {availableAccessibility.map(item => (
                <div
                  key={item.key}
                  className="flex items-center p-3 bg-green-50 rounded-lg"
                >
                  <span className="text-2xl mr-2">{item.icon}</span>
                  <span className="text-sm font-medium text-green-900">{item.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">접근성 정보가 없습니다.</p>
          )}
        </Card>
      </div>

      {/* Programs */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          진행 중인 프로그램 {center.programs && `(${center.programs.length}개)`}
        </h2>
        {center.programs && center.programs.length > 0 ? (
          <div className="space-y-4">
            {center.programs.map(program => (
              <div key={program.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                      {program.type}
                    </span>
                    {program.cost.free && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        무료
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{program.summary}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>👥 {program.targetAudience.join(', ')}</span>
                  <span>📅 {new Date(program.schedule.start).toLocaleDateString('ko-KR')}</span>
                  {program.capacity && <span>👤 정원 {program.capacity}명</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">현재 진행 중인 프로그램이 없습니다.</p>
        )}
      </Card>
    </div>
  );
}
