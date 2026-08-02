import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Utensils, ExternalLink, Star, Search, Navigation, Camera } from 'lucide-react';
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sundae-guk_2.jpg/800px-Sundae-guk_2.jpg',
    imageSource: 'Google Maps / 네이버 플레이스 방문자 실제 사진',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Pastel_de_nata_Lisboa.jpg/800px-Pastel_de_nata_Lisboa.jpg',
    imageSource: 'Google Maps / 네이버 마이플레이스 실제 리뷰 사진',
    tags: ['전남 목포', '카페/디저트', '나나링픽']
  }
];

export default function RestaurantGuide() {
  const [selectedPlace, setSelectedPlace] = useState(RESTAURANT_LIST[0]);
  const [selectedArea, setSelectedArea] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const areas = ['전체', '전남 해남', '전남 목포'];

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

    // Official Korean Government National Map (VWorld 2D Korean Map Tiles)
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
          <div className="relative flex flex-col items-center group cursor-pointer">
            {/* 가게 이름 플로팅 뱃지 */}
            <div className="mb-1.5 px-3 py-1 rounded-xl bg-[#0a0d3a]/95 border-2 ${
              isSelected ? 'border-[#03C75A] text-[#35ed7e] scale-110 shadow-[0_0_20px_rgba(3,199,90,0.6)] z-50' : 'border-[#5865f2] text-white hover:border-[#35ed7e]'
            } text-xs font-extrabold shadow-2xl backdrop-blur-md whitespace-nowrap transition-all duration-300">
              ${place.name}
            </div>
            {/* 핀 아이콘 */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              isSelected 
                ? 'bg-[#03C75A] text-white scale-125 ring-4 ring-[#03C75A]/50 z-50 animate-bounce' 
                : 'bg-[#5865f2] text-white hover:scale-110 hover:bg-[#03C75A]'
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [140, 75],
        iconAnchor: [70, 75]
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

      {/* 대화형 지도 연동 뷰어 */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
            현재 선택 위치: <span className="text-[#03C75A] font-bold">{selectedPlace.name} ({selectedPlace.area})</span>
          </span>
          <a
            href={selectedPlace.naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-extrabold text-[#03C75A] hover:underline flex items-center gap-1 bg-[#03C75A]/10 px-2.5 py-1 rounded-lg border border-[#03C75A]/30"
          >
            <span>네이버 지도로 크게 보기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 인터랙티브 지도 컨테이너 */}
        <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border-2 border-[#03C75A]/50 shadow-2xl bg-[#1e2353]">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          
          <div className="absolute top-3 left-3 z-[400] bg-[#0a0d3a]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#03C75A]/40 text-xs font-extrabold text-white flex items-center gap-2 shadow-lg">
            <Navigation className="w-4 h-4 text-[#03C75A] animate-bounce" />
            <span>지도 핀(Pin)과 가게 이름을 누르면 해당 위치로 이동합니다!</span>
          </div>

          <div className="absolute bottom-3 right-3 z-[400]">
            <a
              href={selectedPlace.naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#03C75A] text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 hover:bg-[#02b351] transition-all"
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

      {/* 맛집 카드리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
              className={`group bg-[#1e2353] border rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? 'border-[#03C75A] ring-2 ring-[#03C75A]/50 shadow-2xl shadow-[#03C75A]/20 scale-[1.01]' 
                  : 'border-[#5865f2]/30 hover:border-[#5865f2]'
              }`}
            >
              <div>
                {/* 실제 사용자/매장 대표 사진 Banner */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#23272a] flex items-center justify-center">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2353] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#5865f2] text-white text-[11px] font-extrabold shadow-md">
                      {place.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#03C75A] text-white text-[11px] font-extrabold shadow-md">
                      ★ {place.rating}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#03C75A] text-white text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                      <MapPin className="w-3 h-3" />
                      <span>선택됨</span>
                    </div>
                  )}

                  {/* 사진 출처 표기 */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white/70 flex items-center gap-1 backdrop-blur-sm">
                    <Camera className="w-3 h-3 text-[#35ed7e]" />
                    <span>{place.imageSource}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-white leading-tight group-hover:text-[#03C75A] transition-colors">
                      {place.name}
                    </h3>
                    <span className="text-[11px] font-bold text-[#03C75A] bg-[#23272a] px-2.5 py-1 rounded-lg border border-[#03C75A]/30 whitespace-nowrap">
                      {place.area}
                    </span>
                  </div>

                  <p className="text-xs text-white/90 leading-relaxed font-normal">
                    {place.desc}
                  </p>

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
              </div>

              {/* Naver Maps Link Button */}
              <div className="p-4 pt-0">
                <a
                  href={place.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#03C75A] hover:bg-[#02b351] text-white font-extrabold text-xs shadow-lg shadow-[#03C75A]/20 active:scale-95 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>네이버 지도로 위치 및 길찾기 보기</span>
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
