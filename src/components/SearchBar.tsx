import { useState, useEffect } from 'react';
import type { SearchFilters, TargetAudience, ProgramType } from '../types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  defaultQuery?: string;
  defaultFilters?: SearchFilters;
}

export function SearchBar({ onSearch, defaultQuery = '', defaultFilters }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters || {});

  const targetAudiences: TargetAudience[] = ['어르신', '장애인', '아동', '청년', '보호자', '저소득', '다문화', '일반'];
  const programTypes: ProgramType[] = ['신체', '정신', '상담', '교육', '돌봄', '기타'];

  // 필터나 쿼리가 변경될 때 자동으로 검색
  useEffect(() => {
    onSearch(query, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, query]); // onSearch는 부모에서 전달되므로 의도적으로 제외

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const toggleTargetAudience = (target: TargetAudience) => {
    setFilters(prev => {
      const current = prev.targetAudience || [];
      const updated = current.includes(target)
        ? current.filter(t => t !== target)
        : [...current, target];
      return { ...prev, targetAudience: updated.length > 0 ? updated : undefined };
    });
  };

  const toggleProgramType = (type: ProgramType) => {
    setFilters(prev => {
      const current = prev.programType || [];
      const updated = current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type];
      return { ...prev, programType: updated.length > 0 ? updated : undefined };
    });
  };

  const resetFilters = () => {
    setFilters({});
    setQuery('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 senior-spacing" role="search" aria-label="복지관 및 프로그램 검색">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <Input
            id="search-input"
            type="search"
            placeholder="복지관이나 프로그램 이름 입력"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full senior-search-input text-high-contrast"
            aria-describedby="search-help"
            aria-label="검색어 입력"
          />
          <span id="search-help" className="sr-only">
            복지관 이름, 프로그램 이름, 태그로 검색할 수 있습니다
          </span>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            type="submit"
            aria-label="검색 실행"
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl font-bold px-6 sm:px-8"
          >
            🔍 검색
          </Button>
        </div>
      </form>

      <div
        id="filter-panel"
        className="p-4 sm:p-6 lg:p-8 bg-blue-50 rounded-2xl space-y-6 sm:space-y-8 border-2 border-blue-200"
        role="region"
        aria-label="검색 필터"
      >
        <div>
          <Label className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 block text-high-contrast">이용 대상 선택</Label>
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4" role="group" aria-label="대상 필터">
            {targetAudiences.map(target => (
              <button
                key={target}
                type="button"
                onClick={() => toggleTargetAudience(target)}
                className={`senior-badge transition-all text-sm sm:text-base ${filters.targetAudience?.includes(target)
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-400 hover:scale-105'
                  }`}
                aria-pressed={filters.targetAudience?.includes(target)}
                aria-label={`${target} ${filters.targetAudience?.includes(target) ? '선택됨' : '선택 안됨'}`}
              >
                {target}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 block text-high-contrast">프로그램 종류 선택</Label>
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4" role="group" aria-label="프로그램 유형 필터">
            {programTypes.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleProgramType(type)}
                className={`senior-badge transition-all text-sm sm:text-base ${filters.programType?.includes(type)
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-purple-400 hover:scale-105'
                  }`}
                aria-pressed={filters.programType?.includes(type)}
                aria-label={`${type} ${filters.programType?.includes(type) ? '선택됨' : '선택 안됨'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-4">
          <label className="flex items-center space-x-3 sm:space-x-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.free === true}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                free: e.target.checked ? true : undefined
              }))}
              className="text-blue-600 rounded focus:ring-blue-500 w-6 h-6 sm:w-7 sm:h-7"
              id="filter-free"
            />
            <span className="text-base sm:text-xl font-semibold text-gray-800">💰 무료 프로그램만 보기</span>
          </label>

          <label className="flex items-center space-x-3 sm:space-x-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.online === true}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                online: e.target.checked ? true : undefined
              }))}
              className="text-blue-600 rounded focus:ring-blue-500 w-6 h-6 sm:w-7 sm:h-7"
              id="filter-online"
            />
            <span className="text-base sm:text-xl font-semibold text-gray-800">💻 온라인 가능 프로그램</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-200 mt-4 sm:mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            aria-label="모든 필터 초기화"
            className="text-lg sm:text-xl font-bold px-6 sm:px-8 w-full sm:w-auto"
          >
            🔄 초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
