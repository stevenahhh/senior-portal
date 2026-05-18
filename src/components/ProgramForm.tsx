import { useState } from 'react';
import type { Program, ProgramType, TargetAudience } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface ProgramFormProps {
  program?: Program | null;
  centerId: string;
  centerName: string;
  onSave: (program: Program) => void;
  onCancel: () => void;
}

export function ProgramForm({ program, centerId, centerName, onSave, onCancel }: ProgramFormProps) {
  const [formData, setFormData] = useState({
    title: program?.title || '',
    summary: program?.summary || '',
    type: program?.type || '신체' as ProgramType,
    targetAudience: program?.targetAudience || [] as TargetAudience[],
    eligibility: program?.eligibility || '',
    free: program?.cost.free ?? true,
    amount: program?.cost.amount || 0,
    discountPolicy: program?.cost.discountPolicy || '',
    scheduleType: program?.schedule.type || 'single' as const,
    startDate: program?.schedule.start ? new Date(program.schedule.start).toISOString().slice(0, 16) : '',
    endTime: program?.schedule.end ? new Date(program.schedule.end).toISOString().slice(11, 16) : '',
    rrule: program?.schedule.rrule || '',
    capacity: program?.capacity || 20,
    registrationMethod: program?.registrationMethod || '전화 신청',
    phone: program?.contact.phone || '',
    email: program?.contact.email || '',
    online: program?.online || false,
    locationNote: program?.locationNote || '',
    tags: program?.tags.join(', ') || '',
    status: program?.status || 'draft' as const,
  });

  const programTypes: ProgramType[] = ['신체', '정신', '상담', '교육', '돌봄', '기타'];
  const targetAudiences: TargetAudience[] = ['어르신', '장애인', '아동', '청년', '보호자', '저소득', '다문화', '일반'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.summary || !formData.startDate) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const startDateTime = new Date(formData.startDate);
    const [endHour, endMinute] = formData.endTime.split(':');
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(parseInt(endHour || '0'), parseInt(endMinute || '0'));

    const newProgram: Program = {
      id: program?.id || `program-${Date.now()}`,
      centerId,
      centerName,
      title: formData.title,
      summary: formData.summary,
      type: formData.type,
      targetAudience: formData.targetAudience,
      eligibility: formData.eligibility,
      cost: {
        free: formData.free,
        amount: formData.free ? 0 : formData.amount,
        discountPolicy: formData.discountPolicy || undefined,
      },
      schedule: {
        type: formData.scheduleType,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        rrule: formData.scheduleType === 'recurring' ? formData.rrule : undefined,
      },
      capacity: formData.capacity,
      registrationMethod: formData.registrationMethod,
      contact: {
        phone: formData.phone,
        email: formData.email,
      },
      online: formData.online,
      locationNote: formData.locationNote || undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      accessibilityFlags: [],
      status: formData.status,
      viewCount: program?.viewCount || 0,
      createdAt: program?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(newProgram);
  };

  const toggleTargetAudience = (target: TargetAudience) => {
    setFormData(prev => {
      const current = prev.targetAudience;
      const updated = current.includes(target)
        ? current.filter(t => t !== target)
        : [...current, target];
      return { ...prev, targetAudience: updated };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">기본 정보</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">프로그램명 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="예: 낙상 예방 스트레칭"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="summary">설명 *</Label>
            <textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="프로그램에 대한 간단한 설명을 입력하세요"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="type">프로그램 유형 *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ProgramType }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {programTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>대상 *</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {targetAudiences.map(target => (
                <button
                  key={target}
                  type="button"
                  onClick={() => toggleTargetAudience(target)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${formData.targetAudience.includes(target)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                    }`}
                >
                  {target}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="eligibility">참가 조건</Label>
            <Input
              id="eligibility"
              value={formData.eligibility}
              onChange={(e) => setFormData(prev => ({ ...prev, eligibility: e.target.value }))}
              placeholder="예: 만 65세 이상, 해당 구 거주자"
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">일정 및 장소</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="scheduleType">일정 유형</Label>
            <select
              id="scheduleType"
              value={formData.scheduleType}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduleType: e.target.value as 'single' | 'recurring' }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">단일 일정</option>
              <option value="recurring">반복 일정</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">시작 일시 *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endTime">종료 시각 *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
          </div>

          {formData.scheduleType === 'recurring' && (
            <div>
              <Label htmlFor="rrule">반복 규칙 (RRULE)</Label>
              <Input
                id="rrule"
                value={formData.rrule}
                onChange={(e) => setFormData(prev => ({ ...prev, rrule: e.target.value }))}
                placeholder="예: FREQ=WEEKLY;BYDAY=MO,WE;COUNT=8"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                예시: 매주 월,수 8회 → FREQ=WEEKLY;BYDAY=MO,WE;COUNT=8
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="online"
              checked={formData.online}
              onChange={(e) => setFormData(prev => ({ ...prev, online: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Label htmlFor="online" className="mb-0">온라인 진행</Label>
          </div>

          {!formData.online && (
            <div>
              <Label htmlFor="locationNote">장소</Label>
              <Input
                id="locationNote"
                value={formData.locationNote}
                onChange={(e) => setFormData(prev => ({ ...prev, locationNote: e.target.value }))}
                placeholder="예: 3층 체육실"
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="capacity">정원 (명)</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
              min="1"
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">비용 및 신청</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="free"
              checked={formData.free}
              onChange={(e) => setFormData(prev => ({ ...prev, free: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Label htmlFor="free" className="mb-0">무료 프로그램</Label>
          </div>

          {!formData.free && (
            <>
              <div>
                <Label htmlFor="amount">참가 비용 (원)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                  min="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="discountPolicy">할인 정책</Label>
                <Input
                  id="discountPolicy"
                  value={formData.discountPolicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPolicy: e.target.value }))}
                  placeholder="예: 기초생활수급자 50% 감면"
                  className="mt-1"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="registrationMethod">신청 방법</Label>
            <Input
              id="registrationMethod"
              value={formData.registrationMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, registrationMethod: e.target.value }))}
              placeholder="예: 전화 신청"
              className="mt-1"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">문의 전화</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="02-000-0000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">문의 이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@center.or.kr"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">기타 정보</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="예: 낙상예방, 스트레칭, 건강"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status">상태</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">임시저장</option>
              <option value="published">게시</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          {program ? '수정 완료' : '등록하기'}
        </Button>
      </div>
    </form>
  );
}
