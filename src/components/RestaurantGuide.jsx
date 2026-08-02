import React, { useState } from 'react';
import { MapPin, Utensils, ExternalLink, Star, Compass, Coffee, Search } from 'lucide-react';

const RESTAURANT_LIST = [
  {
    id: 1,
    name: '정돈 대학로본점',
    category: '일식/돈카츠',
    area: '대학로/혜화',
    rating: 4.8,
    desc: '대학로에서 줄 서서 먹는 수제 프리미엄 안심/등심 돈카츠 전문점.',
    recommendedMenu: '수제 안심 돈카츠, 프리미엄 등심 돈카츠',
    address: '서울 종로구 대학로9길 12',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%EC%A0%95%EB%8F%88',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    tags: ['대학로/혜화', '일식/돈카츠']
  },
  {
    id: 2,
    name: '순대실록 대학로본점',
    category: '한식/순대',
    area: '대학로/혜화',
    rating: 4.7,
    desc: '조선시대 수운잡방을 바탕으로 만든 전통 순대스테이크와 순대국 맛집.',
    recommendedMenu: '순대 스테이크, 전통 순댓국',
    address: '서울 종로구 동숭길 127',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%EC%88%9C%EB%8C%80%EC%8B%A4%EB%A1%9D',
    imageUrl: 'https://images.unsplash.com/photo-1547496592-1b9d4bee6c6d?auto=format&fit=crop&w=600&q=80',
    tags: ['대학로/혜화', '한식']
  },
  {
    id: 3,
    name: '학림다방',
    category: '카페/디저트',
    area: '대학로/혜화',
    rating: 4.9,
    desc: '1956년부터 대학로를 지켜온 레트로 클래식 감성의 역사 깊은 다방.',
    recommendedMenu: '비엔나 커피, 파르페, 원형 치즈케이크',
    address: '서울 종로구 대학로 119 2층',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%ED%95%99%EB%A6%BC%EB%8B%A4%EB%B0%A9',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    tags: ['대학로/혜화', '카페/디저트']
  },
  {
    id: 4,
    name: '핏제리아오 대학로본점',
    category: '양식/화덕피자',
    area: '대학로/혜화',
    rating: 4.7,
    desc: '세계 핏자 챔피언십 출신의 셰프가 선사하는 참나무 화덕 나폴리 피자.',
    recommendedMenu: '오핏자, 마르게리따, 자몽 에이드',
    address: '서울 종로구 동숭길 86',
    naverMapUrl: 'https://map.naver.com/p/search/%EB%8C%80%ED%95%99%EB%A1%9C%20%ED%95%8F%EC%A0%9C%EB%A6%AC%EC%95%84%EC%98%A4',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    tags: ['대학로/혜화', '양식']
  }
];

export default function RestaurantGuide() {
  const [selectedTag, setSelectedTag] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const tags = ['전체', '대학로/혜화', '한식', '일식/돈카츠', '양식', '카페/디저트'];

  const filteredList = RESTAURANT_LIST.filter(item => {
    const matchesTag = selectedTag === '전체' || item.tags.includes(selectedTag) || item.category === selectedTag;
    const matchesQuery = item.name.includes(searchQuery) || item.address.includes(searchQuery) || item.recommendedMenu.includes(searchQuery);
    return matchesTag && matchesQuery;
  });

  return (
    <div className="w-full space-y-6 animate-fade-in font-['Plus_Jakarta_Sans','Paperlogy',sans-serif]">
      {/* 헤더 바 */}
      <div className="border-b border-[#5865f2]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#35ed7e] animate-pulse" />
            나나링의 추천 맛집
          </h2>
          <p className="text-xs text-white/50 mt-1">대학로 공연 관람 전후로 즐기기 좋은 검증된 맛집 코스!</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#35ed7e]/20 border border-[#35ed7e]/40 text-[#35ed7e] uppercase">
            NAVER MAP LINKED
          </span>
        </div>
      </div>

      {/* 검색 & 카테고리 태그 바 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* 태그 버튼 그룹 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-[#5865f2] text-white shadow-md shadow-[#5865f2]/30'
                  : 'bg-[#1e2353] text-white/70 hover:bg-[#5865f2]/20 hover:text-white border border-[#5865f2]/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="맛집 이름, 메뉴 검색..."
            className="w-full bg-[#1e2353] border border-[#5865f2]/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#5865f2]"
          />
        </div>
      </div>

      {/* 맛집 리스트 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {filteredList.map(place => (
          <div
            key={place.id}
            className="bg-[#1e2353] border border-[#5865f2]/30 rounded-2xl overflow-hidden hover:border-[#35ed7e] transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* 대표 이미지 & 카테고리 태그 */}
              <div className="relative aspect-[16/9] overflow-hidden bg-[#23272a]">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2353] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#5865f2] text-white text-[11px] font-extrabold shadow-md">
                    {place.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#23272a]/90 text-[#35ed7e] text-[11px] font-extrabold backdrop-blur-md">
                    ★ {place.rating}
                  </span>
                </div>
              </div>

              {/* 맛집 상세정보 */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-extrabold text-white leading-tight">
                    {place.name}
                  </h3>
                  <span className="text-[11px] text-white/50 bg-[#23272a] px-2 py-0.5 rounded border border-white/5 whitespace-nowrap">
                    {place.area}
                  </span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed font-normal">
                  {place.desc}
                </p>

                <div className="p-3 bg-[#23272a] rounded-xl border border-[#5865f2]/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#35ed7e] font-extrabold">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>추천 메뉴: {place.recommendedMenu}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#ec48bd]" />
                    <span className="truncate">{place.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 네이버 지도 연동 액션 버튼 */}
            <div className="p-4 pt-0">
              <a
                href={place.naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#03C75A] hover:bg-[#02b351] text-white font-extrabold text-xs shadow-lg shadow-[#03C75A]/20 active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>네이버 지도로 위치 및 길찾기 보기</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
