import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Utensils, ExternalLink, Star, Search, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RESTAURANT_LIST = [
  {
    id: 1,
    name: '신창손순대국밥',
    category: '한식/국밥',
    area: '전남 해남',
    rating: 4.9,
    lat: 34.6865,
    lng: 126.3980,
    desc: '해남 탁 트인 바다 전망과 함께 즐기는 깊고 얼큰한 맛의 전통 수제 손순대국밥 전문점.',
    recommendedMenu: '모듬순대, 순대국밥, 소머리국밥',
    address: '전남 해남군 산이면 관광레저로 1673 (신창리 483-3)',
    naverMapUrl: 'https://map.naver.com/p/search/%ED%95%B4%EB%82%A8%20%EC%8B%A0%EC%B0%BD%EC%86%90%EC%88%9C%EB%8C%80%EA%B5%AD%EB%B0%A5',
    tags: ['전남 해남', '한식/국밥', '나나링픽']
  },
  {
    id: 2,
    name: '커피창고로 (북항점)',
    category: '카페/디저트',
    area: '전남 목포',
    rating: 4.9,
    lat: 34.8095,
    lng: 126.3758,
    desc: '목포 북항에서 제일 유명한 인생 에그타르트 맛집! 겹겹이 바삭한 페스츄리에 촉촉한 커스터드 크림이 일품.',
    recommendedMenu: '수제 에그타르트, 아인슈페너, 크림라떼',
    address: '전남 목포시 원산중앙로 45 (북항)',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%AA%A9%ED%8F%AC%20%EB%B6%81%ED%95%AD%20%EC%97%90%EA%B7%B8%ED%83%80%EB%A5%B4%ED%8A%B8',
    tags: ['전남 목포', '카페/디저트', '나나링픽']
  },
  {
    id: 3,
    name: '온길',
    category: '카페/디저트',
    area: '전남 강진',
    rating: 4.9,
    lat: 34.5599723,
    lng: 126.7900678,
    desc: '전남 강진 칠량의 탁 트인 전경과 정갈하고 아늑한 분위기 속에서 여유를 즐길 수 있는 카페.',
    recommendedMenu: '시그니처 크림라떼, 수제 에이드, 디저트',
    address: '전남 강진군 칠량면 칠량옹기로 115 3층 (봉황리 202)',
    naverMapUrl: 'https://naver.me/xxopUp9Q',
    tags: ['전남 강진', '카페/디저트', '나나링픽']
  }
];

export default function RestaurantGuide() {
  const [selectedPlace, setSelectedPlace] = useState(RESTAURANT_LIST[0]);
  const [selectedArea, setSelectedArea] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const areas = ['전체', '전남 해남', '전남 목포', '전남 강진'];

  const filteredList = RESTAURANT_LIST.filter(item => {
    const matchesArea = selectedArea === '전체' || item.area === selectedArea;
    const matchesQuery = item.name.includes(searchQuery) || item.address.includes(searchQuery) || item.recommendedMenu.includes(searchQuery);
    return matchesArea && matchesQuery;
  });

  // Initialize Leaflet Map with VWorld Official Korean Map Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [selectedPlace.lat, selectedPlace.lng],
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 6,
      attribution: '&copy; VWorld 공간정보'
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Pan Map on Selection Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    filteredList.forEach(place => {
      const isSelected = selectedPlace?.id === place.id;
      
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker-pin',
        html: `
          <div style="display: flex; flex-direction: column; items-align: center; align-items: center; cursor: pointer;">
            <div style="
              background-color: ${isSelected ? '#03C75A' : '#ffffff'};
              color: ${isSelected ? '#ffffff' : '#000000'};
              font-weight: 800;
              font-size: 12px;
              padding: 4px 10px;
              border-radius: 8px;
              border: 2px solid ${isSelected ? '#029944' : '#333333'};
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              white-space: nowrap;
              margin-bottom: 4px;
              transition: all 0.2s ease-in-out;
            ">
              ${place.name}
            </div>
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: ${isSelected ? '#03C75A' : '#5865f2'};
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.4);
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [140, 70],
        iconAnchor: [70, 70]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedPlace(place);
        map.flyTo([place.lat, place.lng], 14, { duration: 1.2 });
      });

      markersRef.current[place.id] = marker;
    });

    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 14, { duration: 1.2 });
    }
  }, [filteredList, selectedPlace]);

  return (
    <div className="w-full space-y-6 animate-fade-in font-['Plus_Jakarta_Sans','Paperlogy',sans-serif]">
      {/* 헤더 바 */}
      <div className="border-b border-[#5865f2]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#03C75A] animate-ping" />
            나나링픽 가게
          </h2>
          <p className="text-xs text-[#03C75A] font-bold mt-1">나나링이 직접 방문해 본 가게들</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#03C75A]/20 border border-[#03C75A]/40 text-[#03C75A] uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            NAVER MAP LINKED
          </span>
        </div>
      </div>

      {/* 대화형 지도 뷰어 */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
            현재 선택 위치: <span className="text-[#03C75A] font-bold">{selectedPlace.name} ({selectedPlace.area})</span>
          </span>
        </div>

        {/* 인터랙티브 지도 컨테이너 */}
        <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border-2 border-[#03C75A]/50 shadow-2xl bg-[#1e2353]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          
          <div className="absolute top-3 left-3 z-[400] bg-[#0a0d3a]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#03C75A]/40 text-xs font-extrabold text-white flex items-center gap-2 shadow-lg">
            <Navigation className="w-4 h-4 text-[#03C75A] animate-bounce" />
            <span>지도 핀과 가게 이름을 누르면 해당 위치로 이동합니다!</span>
          </div>

          <div className="absolute bottom-3 right-3 z-[400]">
            <a
              href={selectedPlace.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#03C75A] text-white font-extrabold text-xs sm:text-sm shadow-2xl flex items-center gap-2 hover:bg-[#02b351] active:scale-95 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>{selectedPlace.name} 네이버 지도 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 검색 & 지역 카테고리 필터 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => {
                setSelectedArea(area);
                const firstMatch = RESTAURANT_LIST.find(p => area === '전체' || p.area === area);
                if (firstMatch) setSelectedPlace(firstMatch);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedArea === area
                  ? 'bg-[#03C75A] text-white shadow-md shadow-[#03C75A]/30'
                  : 'bg-[#1e2353] text-white/70 hover:bg-[#5865f2]/20 hover:text-white border border-[#5865f2]/30'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="가게 이름, 추천 메뉴 검색..."
            className="w-full bg-[#1e2353] border border-[#5865f2]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#03C75A]"
          />
        </div>
      </div>

      {/* 맛집 카드리스트 (사진 없는 텍스트 전용 깔끔한 텍스트 리스트) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredList.map(place => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <div
              key={place.id}
              onClick={() => {
                setSelectedPlace(place);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([place.lat, place.lng], 14, { duration: 1.2 });
                }
              }}
              className={`group bg-[#1e2353] border rounded-2xl p-5 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? 'border-[#03C75A] ring-2 ring-[#03C75A]/50 shadow-2xl shadow-[#03C75A]/20 scale-[1.01]' 
                  : 'border-[#5865f2]/30 hover:border-[#5865f2]'
              }`}
            >
              <div className="space-y-3">
                {/* 헤더 행: 카테고리 / 평점 / 선택 상태 / 지역 */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#5865f2] text-white text-[11px] font-extrabold shadow-md">
                      {place.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#03C75A] text-white text-[11px] font-extrabold shadow-md">
                      ★ {place.rating}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-[#03C75A]/20 border border-[#03C75A]/40 text-[#03C75A] text-[10px] font-extrabold">
                        선택됨
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-[#03C75A] bg-[#23272a] px-2.5 py-1 rounded-lg border border-[#03C75A]/30 whitespace-nowrap">
                    {place.area}
                  </span>
                </div>

                {/* 가게 이름 및 설명 */}
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-[#03C75A] transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed mt-1 font-normal">
                    {place.desc}
                  </p>
                </div>

                {/* 추천 메뉴 & 주소 */}
                <div className="p-3 bg-[#23272a] rounded-xl border border-[#5865f2]/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#03C75A] font-extrabold">
                    <Utensils className="w-3.5 h-3.5 shrink-0" />
                    <span>추천 메뉴: {place.recommendedMenu}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#ec48bd]" />
                    <span className="truncate">{place.address}</span>
                  </div>
                </div>
              </div>

              {/* 네이버 지도 버튼 */}
              <div className="mt-4 pt-2">
                <a
                  href={place.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#03C75A] hover:bg-[#02b351] text-white font-extrabold text-xs shadow-lg shadow-[#03C75A]/20 active:scale-95 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{place.name} 네이버 지도 바로가기</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
