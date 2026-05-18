import type { CenterWithDistance } from '../types';

interface CenterCardProps {
  center: CenterWithDistance;
  onClick?: () => void;
}

export function CenterCard({ center, onClick }: CenterCardProps) {
  const accessibilityFeatures = [];
  if (center.accessibilityFlags.elevator) accessibilityFeatures.push('엘리베이터');
  if (center.accessibilityFlags.wheelchairRamp) accessibilityFeatures.push('휠체어 경사로');
  if (center.accessibilityFlags.wheelchairToilet) accessibilityFeatures.push('장애인 화장실');
  if (center.accessibilityFlags.signLanguageSupport) accessibilityFeatures.push('수어 통역');

  const distanceText = center.distance !== undefined
    ? center.distance < 1000
      ? `${Math.round(center.distance)}미터`
      : `${(center.distance / 1000).toFixed(1)}킬로미터`
    : '';

  const ariaLabel = `${center.name}, ${distanceText ? `거리 ${distanceText}, ` : ''}${center.address}`;

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
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#111111] leading-snug">{center.name}</h3>
          {center.distance !== undefined && (
            <span className="text-[#111111] font-medium flex-shrink-0 text-sm sm:text-base bg-white px-3 py-1 rounded-full border border-gray-300" aria-hidden="true">
              📍 {center.distance < 1000
                ? `${Math.round(center.distance)}m`
                : `${(center.distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{center.description}</p>

        <div className="flex flex-wrap gap-2">
          {center.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs sm:text-sm bg-[#111111] text-white rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-300 space-y-2">
          <div className="flex items-start text-xs sm:text-sm text-[#111111]">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="break-words">{center.address}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-[#111111]">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {center.phone}
          </div>
        </div>

        {accessibilityFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {accessibilityFeatures.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="px-2 py-1 text-xs bg-white text-[#111111] border border-gray-300 rounded-md font-medium"
              >
                ♿ {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CenterCard({ center, onClick }: CenterCardProps) {
  const accessibilityFeatures = [];
  if (center.accessibilityFlags.elevator) accessibilityFeatures.push('엘리베이터');
  if (center.accessibilityFlags.wheelchairRamp) accessibilityFeatures.push('휠체어 경사로');
  if (center.accessibilityFlags.wheelchairToilet) accessibilityFeatures.push('장애인 화장실');
  if (center.accessibilityFlags.signLanguageSupport) accessibilityFeatures.push('수어 통역');

  const distanceText = center.distance !== undefined
    ? center.distance < 1000
      ? `${Math.round(center.distance)}미터`
      : `${(center.distance / 1000).toFixed(1)}킬로미터`
    : '';

  const ariaLabel = `${center.name}, ${distanceText ? `거리 ${distanceText}, ` : ''}${center.address}`;

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
          <h3 className="text-xl sm:text-2xl font-bold text-high-contrast leading-snug">{center.name}</h3>
          {center.distance !== undefined && (
            <span className="senior-meta text-blue-600 flex-shrink-0 text-base sm:text-lg" aria-hidden="true">
              📍 {center.distance < 1000
                ? `${Math.round(center.distance)}m`
                : `${(center.distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{center.description}</p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {center.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2 sm:pt-3 border-t border-gray-100 space-y-1.5 sm:space-y-2">
          <div className="flex items-start text-xs sm:text-sm text-gray-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="break-words">{center.address}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {center.phone}
          </div>
        </div>

        {accessibilityFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-2">
            {accessibilityFeatures.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded"
              >
                ♿ {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
