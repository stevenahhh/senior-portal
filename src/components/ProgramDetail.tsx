import { useState, useEffect } from 'react';
import type { ProgramWithDistance } from '../types';
import { apiClient } from '../api/client';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ProgramDetailProps {
  programId: string;
  onBack: () => void;
}

export function ProgramDetail({ programId, onBack }: ProgramDetailProps) {
  const [program, setProgram] = useState<ProgramWithDistance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgram();
  }, [programId]);

  const loadProgram = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getProgram(programId);
      setProgram(data);
    } catch (err) {
      setError('프로그램 정보를 불러올 수 없습니다.');
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

  if (error || !program) {
    return (
      <div className="text-center py-12" role="alert" aria-live="assertive">
        <p className="text-red-600 mb-4">{error || '프로그램을 찾을 수 없습니다.'}</p>
        <Button onClick={onBack} variant="outline">돌아가기</Button>
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseRRule = (rrule: string) => {
    const parts: Record<string, string> = {};
    rrule.split(';').forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) parts[key] = value;
    });
    return parts;
  };

  const getScheduleDescription = () => {
    if (program.schedule.type === 'single') {
      return '단일 일정';
    }

    if (program.schedule.rrule) {
      const rrule = parseRRule(program.schedule.rrule);
      const dayMap: Record<string, string> = {
        MO: '월', TU: '화', WE: '수', TH: '목', FR: '금', SA: '토', SU: '일'
      };

      let description = '';

      if (rrule.FREQ === 'WEEKLY') {
        description = '매주 ';
        if (rrule.BYDAY) {
          const days = rrule.BYDAY.split(',').map(d => dayMap[d] || d);
          description += days.join(', ') + '요일';
        }
      } else if (rrule.FREQ === 'DAILY') {
        description = '매일';
      } else if (rrule.FREQ === 'MONTHLY') {
        description = '매월';
      }

      if (rrule.COUNT) {
        description += ` (총 ${rrule.COUNT}회)`;
      }

      return description;
    }

    return '반복 일정';
  };

  const accessibilityLabels: Record<string, string> = {
    elevator: '엘리베이터',
    wheelchair_toilet: '장애인 화장실',
    sign_language: '수어 통역',
    no_threshold: '문턱 없음',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          aria-label="프로그램 목록으로 돌아가기"
          className="w-full rounded-xl h-12 text-base font-semibold bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700"
        >
          ← 목록으로 돌아가기
        </Button>
      </div>

      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full">
              {program.type}
            </span>
            {program.cost.free ? (
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                무료
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded-full">
                {program.cost.amount?.toLocaleString()}원
              </span>
            )}
            {program.online && (
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                온라인
              </span>
            )}
            <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
              {program.status === 'published' ? '진행중' : program.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{program.title}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{program.summary}</p>

          {program.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {program.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Main Info Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Schedule & Location */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">일정 및 장소</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">일정 유형</p>
              <p className="text-gray-900">{getScheduleDescription()}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">시작 일시</p>
              <p className="text-gray-900">{formatDateTime(program.schedule.start)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">종료 시각</p>
              <p className="text-gray-900">
                {new Date(program.schedule.end).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {program.locationNote && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">장소</p>
                <p className="text-gray-900">{program.locationNote}</p>
              </div>
            )}

            {program.center && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium text-gray-500 mb-1">진행 기관</p>
                <p className="text-gray-900 font-medium">{program.center.name}</p>
                <p className="text-sm text-gray-600 mt-1">{program.center.address}</p>
                <p className="text-sm text-gray-600">{program.center.phone}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Target & Eligibility */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">대상 및 조건</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">대상</p>
              <div className="flex flex-wrap gap-2">
                {program.targetAudience.map(target => (
                  <span
                    key={target}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
                  >
                    {target}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">참가 조건</p>
              <p className="text-gray-900">{program.eligibility}</p>
            </div>

            {program.capacity && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">정원</p>
                <p className="text-gray-900">{program.capacity}명</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">비용</p>
              <p className="text-gray-900">
                {program.cost.free ? '무료' : `${program.cost.amount?.toLocaleString()}원`}
              </p>
              {program.cost.discountPolicy && (
                <p className="text-sm text-gray-600 mt-1">{program.cost.discountPolicy}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Registration & Contact */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">신청 및 문의</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">신청 방법</p>
            <p className="text-gray-900">{program.registrationMethod}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 mb-2">문의처</p>
            {program.contact.phone && (
              <div className="flex items-center text-gray-900">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {program.contact.phone}
              </div>
            )}
            {program.contact.email && (
              <div className="flex items-center text-gray-900">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {program.contact.email}
              </div>
            )}
            {program.contact.url && (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a href={program.contact.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  신청 페이지 바로가기
                </a>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Accessibility */}
      {program.accessibilityFlags.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">접근성 정보</h2>
          <div className="flex flex-wrap gap-2">
            {program.accessibilityFlags.map(flag => (
              <span
                key={flag}
                className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg font-medium"
              >
                ♿ {accessibilityLabels[flag] || flag}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
