import React, { useState } from 'react';
import { MapPin, Utensils, ExternalLink, Star, Search, Coffee, Compass } from 'lucide-react';

const RESTAURANT_LIST = [
  {
    id: 1,
    name: '신창손순대국밥',
    category: '한식/국밥',
    area: '전남 해남',
    rating: 4.9,
    desc: '해남 탁 트인 바다 전망과 함께 즐기는 깊고 얼큰한 맛의 전통 수제 손순대국밥 전문점.',
    recommendedMenu: '모듬순대, 순대국밥, 소머리국밥',
    address: '전남 해남군 산이면 관광레저로 1673 (신창리 483-3)',
    naverMapUrl: 'https://map.naver.com/p/search/%ED%95%B4%EB%82%A8%20%EC%8B%A0%EC%B0%BD%EC%86%90%EC%88%9C%EB%8C%80%EA%B5%AD%EB%B0%A5',
    naverEmbedUrl: 'https://m.place.naver.com/rest/search?query=%ED%95%B4%EB%82%A8%20%EC%8B%A0%EC%B0%BD%EC%86%90%EC%88%9C%EB%8C%80%EA%B5%AD%EB%B0%A5',
    imageUrl: 'https://images.unsplash.com/photo-1547496592-1b9d4bee6c6d?auto=format&fit=crop&w=800&q=80',
    tags: ['전남 해남', '한식/국밥', '나나링픽']
  },
  {
    id: 2,
    name: '커피창고로 (북항점)',
    category: '카페/디저트',
    area: '전남 목포',
    rating: 4.9,
    desc: '목포 북항에서 제일 유명한 인생 에그타르트 맛집! 겹겹이 바삭한 페스츄리에 촉촉한 커스터드 크림이 일품.',
    recommendedMenu: '수제 에그타르트, 아인슈페너, 크림라떼',
    address: '전남 목포시 원산중앙로 45 (북항)',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%AA%A9%ED%8F%AC%20%EB%B6%81%ED%95%AD%20%EC%97%90%EA%B7%B8%ED%83%80%EB%A5%B4%ED%8A%B8',
    naverEmbedUrl: 'https://m.place.naver.com/rest/search?query=%EB%AA%A9%ED%8F%AC%20%EB%B6%81%ED%95%AD%20%EC%97%90%EA%B7%B8%ED%83%80%EB%A5%B4%ED%8A%B8',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    tags: ['전남 목포', '카페/디저트', '나나링픽']
  },
  {
    id: 3,
    name: '정돈 대학로본점',
    category: '일식/돈카츠',
    area: '서울 대학로',
    rating: 4.8,
    desc: '대학로에서 줄 서서 먹는 부드럽고 촉촉한 수제 프리미엄 안심/등심 돈카츠.',
    recommendedMenu: '수제 안심 돈카츠, 프리미엄 등심 돈카츠',
    address: '서울 종로구 대학로9길 12',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%EC%A0%95%EB%8F%88',
    naverEmbedUrl: 'https://m.place.naver.com/rest/search?query=%EB%8C%80%ED%95%99%EB%A1%9C%20%EC%A0%95%EB%8F%88',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    tags: ['서울 대학로', '일식/돈카츠', '나나링픽']
  },
  {
    id: 4,
    name: '학림다방',
    category: '카페/디저트',
    area: '서울 대학로',
    rating: 4.9,
    desc: '1956년부터 대학로의 역사와 함께 해온 고풍스러운 비엔나 커피 맛집.',
    recommendedMenu: '비엔나 커피, 크림 치즈케이크',
    address: '서울 종로구 대학로 119 2층',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%ED%95%99%EB%A6%BC%EB%8B%A4%EB%B0%A9',
    naverEmbedUrl: 'https://m.place.naver.com/rest/search?query=%EB%8C%80%ED%95%99%EB%A1%9C%20%ED%95%99%EB%A6%BC%EB%8B%A4%EB%B0%A9',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    tags: ['서울 대학로', '카페/디저트', '나나링픽']
  }
];

export default function RestaurantGuide() {
  const [selectedPlace, setSelectedPlace] = useState(RESTAURANT_LIST[0]);
  const [selectedArea, setSelectedArea] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const areas = ['전체', '전남 해남', '전남 목포', '서울 대학로'];

  const filteredList = RESTAURANT_LIST.filter(item => {
    const matchesArea = selectedArea === '전체' || item.area === selectedArea;
    const matchesQuery = item.name.includes(searchQuery) || item.address.includes(searchQuery) || item.recommendedMenu.includes(searchQuery);
    return matchesArea && matchesQuery;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in font-['Plus_Jakarta_Sans','Paperlogy',sans-serif]">
      {/* 헤더 바 */}
      <div className="border-b border-[#5865f2]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#03C75A] animate-pulse" />
            나나링픽 가게
          </h2>
          <p className="text-xs text-[#03C75A] font-bold mt-1">나나링이 직접 방문해 본 가게들 (네이버 지도 연동)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#03C75A]/20 border border-[#03C75A]/40 text-[#03C75A] uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            NAVER MAP INTEGRATED
          </span>
        </div>
      </div>

      {/* 네이버 지도 라이브 연동 뷰어 */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
            현재 선택된 장소 네이버 지도 뷰어: <span className="text-[#35ed7e]">{selectedPlace.name} ({selectedPlace.area})</span>
          </span>
          <a
            href={selectedPlace.naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#03C75A] hover:underline flex items-center gap-1"
          >
            <span>네이버 지도 앱에서 크게 보기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 네이버 지도 임베드 프레임 */}
        <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden border-2 border-[#03C75A]/50 shadow-2xl bg-[#1e2353]">
          <iframe
            key={selectedPlace.id}
            src={selectedPlace.naverEmbedUrl}
            title={`${selectedPlace.name} 네이버 지도`}
            className="w-full h-full border-0"
            allowFullScreen
          />
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
              onClick={() => setSelectedPlace(place)}
              className={`group bg-[#1e2353] border rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? 'border-[#03C75A] ring-2 ring-[#03C75A]/50 shadow-2xl shadow-[#03C75A]/20 scale-[1.01]' 
                  : 'border-[#5865f2]/30 hover:border-[#5865f2]'
              }`}
            >
              <div>
                {/* Image Banner with Fallback System */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#23272a] flex items-center justify-center">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      // Fallback gradient/styled placeholder if network image fails
                      e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                    }}
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
                      <span>지도 뷰어 선택됨</span>
                    </div>
                  )}
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
