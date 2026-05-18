import React, { useState, useEffect, useCallback, useRef } from 'react';
import { dataSource } from './api/dataSource';
import { useGeolocation } from './hooks/useGeolocation';
import { SearchBar } from './components/SearchBar';
import { CenterCard } from './components/CenterCard';
import { ProgramCard } from './components/ProgramCard';
import { CenterDetail } from './components/CenterDetail';
import { ProgramDetail } from './components/ProgramDetail';
import { Button } from './components/ui/button';
import { SkipToContent, LiveRegion } from './utils/accessibility';
import type {
  CenterWithDistance,
  ProgramWithDistance,
  SearchFilters,
} from './types';
import "./index.css";

type ViewMode = 'centers' | 'programs';
type DetailView = { type: 'center'; id: string } | { type: 'program'; id: string } | null;

export function App() {
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const [viewMode, setViewMode] = useState<ViewMode>('programs');
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [allCenters, setAllCenters] = useState<CenterWithDistance[]>([]);
  const [allPrograms, setAllPrograms] = useState<ProgramWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [radius, setRadius] = useState(5000); 
  const [announceMessage, setAnnounceMessage] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [filterCollapsed, setFilterCollapsed] = useState(true); 
  const isLoadingRef = useRef(false);
  const currentPageRef = useRef(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const defaultLocation = { latitude: 34.9506, longitude: 127.4872 };
  const currentLocation = location || defaultLocation;

  useEffect(() => {
    setAllCenters([]);
    setAllPrograms([]);
    currentPageRef.current = 1;
    setHasMore(true);
    if (!detailView) {
      loadInitialData();
    }
  }, [viewMode, currentLocation, searchQuery, searchFilters, radius, detailView]);

  const loadInitialData = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    setAnnounceMessage('데이터를 불러오는 중입니다');

    try {
      const params = {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
        radius,
        query: searchQuery || undefined,
        filters: searchFilters,
        page: 1,
        limit: 20,
        sort: { by: 'distance' as const },
      };

      if (viewMode === 'centers') {
        const data = await dataSource.getCenters(params);
        setAllCenters(data.items);
        setTotalItems(data.pageInfo.totalItems);
        setHasMore(data.pageInfo.hasNext);
        currentPageRef.current = 1;
        setAnnounceMessage(`복지관 ${data.pageInfo.totalItems}개를 찾았습니다.`);
      } else {
        const data = await dataSource.getPrograms(params);
        setAllPrograms(data.items);
        setTotalItems(data.pageInfo.totalItems);
        setHasMore(data.pageInfo.hasNext);
        currentPageRef.current = 1;
        setAnnounceMessage(`프로그램 ${data.pageInfo.totalItems}개를 찾았습니다.`);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setAnnounceMessage('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  const loadMoreData = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;
    isLoadingRef.current = true;
    const nextPage = currentPageRef.current + 1;

    try {
      const params = {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
        radius,
        query: searchQuery || undefined,
        filters: searchFilters,
        page: nextPage,
        limit: 20,
        sort: { by: 'distance' as const },
      };

      if (viewMode === 'centers') {
        const data = await dataSource.getCenters(params);
        setAllCenters(prev => [...prev, ...data.items]);
        setHasMore(data.pageInfo.hasNext);
      } else {
        const data = await dataSource.getPrograms(params);
        setAllPrograms(prev => [...prev, ...data.items]);
        setHasMore(data.pageInfo.hasNext);
      }
      currentPageRef.current = nextPage;
    } catch (error) {
      console.error('Failed to load more data:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [hasMore, viewMode, currentLocation, radius, searchQuery, searchFilters]);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  const currentData = viewMode === 'centers' ? allCenters : allPrograms;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMoreData();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMoreData]);

  if (detailView) {
    return (
      <div className="min-h-screen bg-white text-[#111111] flex flex-col font-inter">
        <SkipToContent />
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-[96px]" role="main">
          {detailView.type === 'center' ? (
            <CenterDetail centerId={detailView.id} onBack={() => setDetailView(null)} />
          ) : (
            <ProgramDetail programId={detailView.id} onBack={() => setDetailView(null)} />
          )}
        </main>
        <footer className="bg-[#101010] text-[#a1a1aa] py-12 px-6 sm:px-8 lg:px-10 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-semibold tracking-tight">Welfare Demo</p>
            <p className="text-sm">© 2026 Welfare Organization. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-inter">
      <SkipToContent />
      <LiveRegion message={announceMessage} />

      <main id="main-content" className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto min-h-[calc(100vh-100px)]" role="main">
        <aside className="lg:w-1/3 xl:w-1/3 bg-white p-6 sm:p-8 lg:h-screen lg:sticky lg:top-0 border-r border-[#e5e5e5]">
          <div className="mb-[96px] pt-8">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-2">지역 사회복지 포털</h1>
            <p className="text-base sm:text-lg text-gray-500">내 주변의 복지관과 프로그램을 쉽게 찾아보세요.</p>
          </div>

          <div className="mb-8">
            <button
              onClick={() => setFilterCollapsed(!filterCollapsed)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#f5f5f5] hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] lg:cursor-default"
              aria-expanded={!filterCollapsed}
              aria-controls="filter-content"
            >
              <h2 className="text-xl font-semibold tracking-tight text-[#111111]">검색 필터</h2>
              <span
                className="lg:hidden text-xl transition-transform font-bold text-[#111111]"
                style={{ transform: filterCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
                aria-hidden="true"
              >
                ↓
              </span>
            </button>
          </div>

          <div
            id="filter-content"
            className={`${filterCollapsed ? 'hidden lg:block' : 'block'}`}
          >
            <div className="mb-8 p-6 bg-[#f5f5f5] rounded-xl" role="status" aria-live="polite">
              {locationLoading ? (
                <p className="text-sm text-gray-600 font-semibold">위치 정보 가져오는 중...</p>
              ) : locationError ? (
                <div className="space-y-2">
                  <p className="text-sm text-red-600 font-semibold">⚠️ {locationError}</p>
                  <p className="text-xs text-red-500">기본 위치로 검색합니다.</p>
                </div>
              ) : (
                <p className="text-sm text-[#111111] font-semibold">현재 위치 기준으로 검색 중</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[#111111] w-full mb-2">검색 반경:</span>
                {[1000, 3000, 5000, 10000].map(r => (
                  <button
                    key={r}
                    onClick={() => handleRadiusChange(r)}
                    className={`transition-all flex-1 text-sm py-2 rounded-md font-medium ${radius === r
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#111111] border border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    {r < 1000 ? `${r}m` : `${r / 1000}km`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SearchBar
                onSearch={handleSearch}
                defaultQuery={searchQuery}
                defaultFilters={searchFilters}
              />
            </div>
          </div>
        </aside>

        <section className="flex-1 p-6 sm:p-8 lg:p-[96px] overflow-y-auto">
          <div className="mb-8 flex flex-row gap-3">
            <button
              onClick={() => setViewMode('programs')}
              className={`text-sm font-medium px-4 py-2 flex-1 rounded-md transition-colors ${viewMode === 'programs' ? 'bg-[#111111] text-white' : 'bg-white border border-gray-300 text-[#111111] hover:bg-gray-50'}`}
            >
              프로그램 찾기
            </button>
            <button
              onClick={() => setViewMode('centers')}
              className={`text-sm font-medium px-4 py-2 flex-1 rounded-md transition-colors ${viewMode === 'centers' ? 'bg-[#111111] text-white' : 'bg-white border border-gray-300 text-[#111111] hover:bg-gray-50'}`}
            >
              복지관 찾기
            </button>
          </div>

          {loading && currentData.length === 0 ? (
            <div className="text-center py-16" role="status" aria-live="polite">
              <div className="inline-block w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
              <p className="mt-4 text-lg font-medium text-gray-600">불러오는 중...</p>
            </div>
          ) : currentData.length > 0 ? (
            <>
              <div className="mb-6 p-[32px] bg-[#f5f5f5] rounded-xl sticky top-0 z-10">
                <p className="text-xl font-semibold tracking-tight text-[#111111]">
                  총 {totalItems}개의 결과를 찾았습니다
                </p>
              </div>

              <div ref={scrollContainerRef} className="h-full overflow-y-auto pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewMode === 'centers' ? (
                    <>
                      {allCenters.map((center) => (
                        <div key={center.id}>
                          <CenterCard
                            center={center}
                            onClick={() => setDetailView({ type: 'center', id: center.id })}
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {allPrograms.map((program) => (
                        <div key={program.id}>
                          <ProgramCard
                            program={program}
                            onClick={() => setDetailView({ type: 'program', id: program.id })}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {loading && (
                  <div className="text-center py-8" role="status" aria-live="polite">
                    <div className="inline-block w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16" role="status">
              <p className="text-xl font-semibold tracking-tight text-gray-600">검색 결과가 없습니다</p>
              <p className="text-base text-gray-500 mt-2">다른 조건으로 검색해보세요.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-[#101010] text-[#a1a1aa] py-12 px-6 sm:px-8 lg:px-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold tracking-tight">Welfare Demo</p>
          <p className="text-sm">© 2026 Welfare Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
