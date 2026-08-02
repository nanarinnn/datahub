import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Utensils, ExternalLink, Star, Search, Sparkles, Navigation } from 'lucide-react';
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
    imageUrl: 'https://images.unsplash.com/photo-1547496592-1b9d4bee6c6d?auto=format&fit=crop&w=600&q=80',
    tags: ['전남 해남', '한식/국밥', '나나링픽']
  },
  {
    id: 2,
    name: '정돈 대학로본점',
    category: '일식/돈카츠',
    area: '서울 대학로',
    rating: 4.8,
    lat: 37.5815,
    lng: 127.0012,
    desc: '대학로에서 줄 서서 먹는 부드럽고 촉촉한 수제 프리미엄 안심/등심 돈카츠.',
    recommendedMenu: '수제 안심 돈카츠, 프리미엄 등심 돈카츠',
    address: '서울 종로구 대학로9길 12',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%EC%A0%95%EB%8F%88',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    tags: ['서울 대학로', '일식/돈카츠', '나나링픽']
  },
  {
    id: 3,
    name: '학림다방',
    category: '카페/디저트',
    area: '서울 대학로',
    rating: 4.9,
    lat: 37.5828,
    lng: 127.0028,
    desc: '1956년부터 대학로의 역사와 함께 해온 고풍스러운 비엔나 커피 맛집.',
    recommendedMenu: '비엔나 커피, 크림 치즈케이크',
    address: '서울 종로구 대학로 119 2층',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%ED%95%99%EB%A6%BC%EB%8B%A4%EB%B0%A9',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    tags: ['서울 대학로', '카페/디저트', '나나링픽']
  },
  {
    id: 4,
    name: '순대실록 대학로본점',
    category: '한식/순대',
    area: '서울 대학로',
    rating: 4.7,
    lat: 37.5818,
    lng: 127.0042,
    desc: '전통 서적 수운잡방을 바탕으로 만든 별미 순대스테이크와 정갈한 순댓국.',
    recommendedMenu: '순대 스테이크, 전통 순댓국',
    address: '서울 종로구 동숭길 127',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%EC%88%9C%EB%8C%80%EC%8B%A4%EB%A1%9D',
    imageUrl: 'https://images.unsplash.com/photo-1547496592-1b9d4bee6c6d?auto=format&fit=crop&w=600&q=80',
    tags: ['서울 대학로', '한식/국밥', '나나링픽']
  }
];

export default function RestaurantGuide() {
  const [selectedPlace, setSelectedPlace] = useState(RESTAURANT_LIST[0]);
  const [selectedArea, setSelectedArea] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const areas = ['전체', '전남 해남', '서울 대학로'];

  const filteredList = RESTAURANT_LIST.filter(item => {
    const matchesArea = selectedArea === '전체' || item.area === selectedArea;
    const matchesQuery = item.name.includes(searchQuery) || item.address.includes(searchQuery) || item.recommendedMenu.includes(searchQuery);
    return matchesArea && matchesQuery;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [selectedPlace.lat, selectedPlace.lng],
      zoom: 12,
      zoomControl: false
    });

    // CartoDB Dark Matter Tile Layer matching Discord Indigo Canvas
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
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

  // Update Markers & Pan/Zoom Map on Selection Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add Markers for Filtered Places
    filteredList.forEach(place => {
      const isSelected = selectedPlace?.id === place.id;
      
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div className="relative cursor-pointer group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
              isSelected 
                ? 'bg-[#35ed7e] text-[#000000] scale-125 ring-4 ring-[#35ed7e]/40 z-50' 
                : 'bg-[#5865f2] text-white hover:scale-110 hover:bg-[#ec48bd]'
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1e2353] border border-[#5865f2]/40 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-xl pointer-events-none">
              ${place.name}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedPlace(place);
        map.flyTo([place.lat, place.lng], 13, { duration: 1.2 });
      });

      markersRef.current[place.id] = marker;
    });

    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 13, { duration: 1.2 });
    }
  }, [filteredList, selectedPlace]);

  return (
    <div className="w-full space-y-6 animate-fade-in font-[#Plus_Jakarta_Sans]">
      {/* 헤더 바 */}
      <div className="border-b border-[#5865f2]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#35ed7e] animate-ping" />
            나나링픽 가게
          </h2>
          <p className="text-xs text-[#35ed7e] font-bold mt-1">나나링이 직접 방문해 본 가게들</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#35ed7e]/20 border border-[#35ed7e]/40 text-[#35ed7e] uppercase">
            INTERACTIVE MAP PINS
          </span>
        </div>
      </div>

      {/* 실시간 대화형 지점 지도 (CartoDB Dark Tile Layer) */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#5865f2]/40 shadow-2xl bg-[#0a0d3a]">
        <div ref={mapContainerRef} className="w-full h-[320px] sm:h-[400px] z-0" />
        
        {/* 지도 오버레이 미니 태그 */}
        <div className="absolute top-3 left-3 z-[400] bg-[#0a0d3a]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#5865f2]/40 text-xs font-extrabold text-white flex items-center gap-2 shadow-lg">
          <Navigation className="w-4 h-4 text-[#35ed7e] animate-bounce" />
          <span>지도의 핀(Pin)을 누르면 해당 가게 정보로 이동합니다!</span>
        </div>
      </div>

      {/* 검색 & 지역 카테고리 필터 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                  ? 'bg-[#35ed7e] text-[#000000] shadow-md shadow-[#35ed7e]/30'
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
            className="w-full bg-[#1e2353] border border-[#5865f2]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#5865f2]"
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
                  mapInstanceRef.current.flyTo([place.lat, place.lng], 13, { duration: 1.2 });
                }
              }}
              className={`group bg-[#1e2353] border rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? 'border-[#35ed7e] ring-2 ring-[#35ed7e]/40 shadow-2xl shadow-[#35ed7e]/10 scale-[1.01]' 
                  : 'border-[#5865f2]/30 hover:border-[#5865f2]'
              }`}
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#23272a]">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2353] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#5865f2] text-white text-[11px] font-extrabold shadow-md">
                      {place.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#35ed7e] text-[#000000] text-[11px] font-extrabold shadow-md">
                      ★ {place.rating}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#35ed7e] text-[#000000] text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                      <MapPin className="w-3 h-3" />
                      <span>현재 선택됨</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-white leading-tight group-hover:text-[#35ed7e] transition-colors">
                      {place.name}
                    </h3>
                    <span className="text-[11px] font-bold text-[#35ed7e] bg-[#23272a] px-2.5 py-1 rounded-lg border border-[#35ed7e]/30 whitespace-nowrap">
                      {place.area}
                    </span>
                  </div>

                  <p className="text-xs text-white/90 leading-relaxed font-normal">
                    {place.desc}
                  </p>

                  <div className="p-3 bg-[#23272a] rounded-xl border border-[#5865f2]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#35ed7e] font-extrabold">
                      <Utensils className="w-3.5 h-3.5 shrink-0" />
                      <span>추천 메뉴: {place.recommendedMenu}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
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
