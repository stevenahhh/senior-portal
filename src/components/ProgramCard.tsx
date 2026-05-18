import type { ProgramWithDistance } from '../types';

interface ProgramCardProps {
  program: ProgramWithDistance;
  onClick?: () => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const distanceText = program.distance !== undefined
    ? program.distance < 1000
      ? `${Math.round(program.distance)}미터`
      : `${(program.distance / 1000).toFixed(1)}킬로미터`
    : '';

  const ariaLabel = `${program.title}, ${program.type}, ${program.cost.free ? '무료' : '유료'}, ${distanceText ? `거리 ${distanceText}, ` : ''}${program.centerName || ''}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className="bg-[#f5f5f5] rounded-xl p-[32px] cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111]"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3" aria-hidden="true">
              <span className="px-3 py-1 text-xs sm:text-sm bg-gray-300 text-[#111111] rounded-full font-medium">
                {program.type}
              </span>
              {program.cost.free && (
                <span className="px-3 py-1 text-xs sm:text-sm bg-green-100 text-green-800 rounded-full font-medium">
                  💰 무료
                </span>
              )}
              {program.online && (
                <span className="px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  💻 온라인
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111111] leading-snug">{program.title}</h3>
          </div>
          {program.distance !== undefined && (
            <span className="text-[#111111] font-medium flex-shrink-0 text-sm sm:text-base bg-white px-3 py-1 rounded-full border border-gray-300">
              📍 {program.distance < 1000
                ? `${Math.round(program.distance)}m`
                : `${(program.distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2">{program.summary}</p>

        <div className="space-y-3">
          {program.centerName && (
            <div className="flex items-start gap-3 text-sm sm:text-base text-[#111111]">
              <span className="flex-shrink-0">🏢</span>
              <span className="line-clamp-1 font-medium break-words">{program.centerName}</span>
            </div>
          )}

          <div className="flex items-start gap-3 text-sm sm:text-base text-[#111111]">
            <span className="flex-shrink-0">📅</span>
            <span className="font-medium break-words">
              {formatDate(program.schedule.start)} {formatTime(program.schedule.start)}
              {program.schedule.type === 'recurring' && ' (반복)'}
            </span>
          </div>

          <div className="flex items-start gap-3 text-sm sm:text-base text-[#111111]">
            <span className="flex-shrink-0">👥</span>
            <span className="font-medium break-words">{program.targetAudience.join(', ')}</span>
          </div>
        </div>

        {program.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-300">
            {program.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white text-gray-600 border border-gray-300 rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const distanceText = program.distance !== undefined
    ? program.distance < 1000
      ? `${Math.round(program.distance)}미터`
      : `${(program.distance / 1000).toFixed(1)}킬로미터`
    : '';

  const ariaLabel = `${program.title}, ${program.type}, ${program.cost.free ? '무료' : '유료'}, ${distanceText ? `거리 ${distanceText}, ` : ''}${program.centerName || ''}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      className="senior-card cursor-pointer focus-within:ring-4 focus-within:ring-blue-500 hover:shadow-xl"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3" aria-hidden="true">
              <span className="senior-badge bg-purple-600 text-white text-xs sm:text-sm">
                {program.type}
              </span>
              {program.cost.free && (
                <span className="senior-badge bg-green-600 text-white text-xs sm:text-sm">
                  💰 무료
                </span>
              )}
              {program.online && (
                <span className="senior-badge bg-blue-600 text-white text-xs sm:text-sm">
                  💻 온라인
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-high-contrast leading-snug">{program.title}</h3>
          </div>
          {program.distance !== undefined && (
            <span className="senior-meta text-blue-600 flex-shrink-0 text-base sm:text-lg">
              📍 {program.distance < 1000
                ? `${Math.round(program.distance)}m`
                : `${(program.distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        <p className="text-base sm:text-lg text-secondary-contrast leading-relaxed line-clamp-2">{program.summary}</p>

        <div className="space-y-2 sm:space-y-3">
          {program.centerName && (
            <div className="flex items-start gap-2 sm:gap-3 text-base sm:text-lg text-gray-700">
              <span className="text-xl sm:text-2xl flex-shrink-0">🏢</span>
              <span className="line-clamp-1 font-semibold break-words">{program.centerName}</span>
            </div>
          )}

          <div className="flex items-start gap-2 sm:gap-3 text-base sm:text-lg text-gray-700">
            <span className="text-xl sm:text-2xl flex-shrink-0">📅</span>
            <span className="font-semibold break-words">
              {formatDate(program.schedule.start)} {formatTime(program.schedule.start)}
              {program.schedule.type === 'recurring' && ' (반복)'}
            </span>
          </div>

          <div className="flex items-start gap-2 sm:gap-3 text-base sm:text-lg text-gray-700">
            <span className="text-xl sm:text-2xl flex-shrink-0">👥</span>
            <span className="font-semibold break-words">{program.targetAudience.join(', ')}</span>
          </div>
        </div>

        {program.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-3 border-t-2 border-gray-200">
            {program.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="senior-badge bg-gray-100 text-gray-800 border-2 border-gray-300 text-xs sm:text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
