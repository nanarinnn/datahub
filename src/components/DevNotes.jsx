import React, { useEffect, useRef } from 'react';
import { Bell, Sparkles, CheckCircle2, ArrowDown } from 'lucide-react';

const DEV_NOTES = [
  {
    id: 1,
    date: '2026.08.01',
    title: '🚀 YUYEON ONLY 프로젝트 아카이브 오픈',
    tag: '기본 시스템',
    isNew: false,
    content: [
      'YUYEON ONLY 메인 플랫폼 오픈'
    ]
  },
  {
    id: 2,
    date: '2026.08.13',
    title: '🎭 작품/캐릭터 추천 & 음원 플레이어 연동',
    tag: '콘텐츠 업데이트',
    isNew: false,
    content: [
      '뮤지컬 사의찬미 "사내", 프리스트, 마마 돈 크라이, 배니싱 작품 및 캐릭터 상세 정보 추가',
      '배니싱 시그니처 OST 음원 플레이어 시스템 탑재'
    ]
  },
  {
    id: 3,
    date: '2026.08.16',
    title: '📍 나나링픽 맛집 지도 1차 연동',
    tag: '지도 시스템',
    isNew: false,
    content: [
      '신창손순대국밥, 커피창고로, 온길, 청보리밭, 이음커피 네이버 지도 연동',
      '네이버 지도 브이월드(VWorld) 한국형 타일 지도 뷰어 인터랙션 구현'
    ]
  },
  {
    id: 4,
    date: '2026.08.29',
    title: '🔔 [시스템 알림] 뮤지컬 시데레우스 & 신규 맛집 & 클라우드 서버 듀얼 연동',
    tag: '데이터 업데이트',
    isNew: true,
    content: [
      '🌌 뮤지컬 시데레우스 작품/캐릭터(갈릴레이, 케플러, 마리아 첼레스테) 및 듀얼 공연 영상 연동',
      '📍 나나링픽 가게 5곳 추가 (씨엘비베이커리, 이모네탕집, 수라간 박상선, 다온솥밥, 나나방콕 남악도청점)',
      '☁️⚡ 2026 구글 클라우드 스토리지 (GCS yuyeon-private-bucket) & 2027 Supabase DB 이중 서버 구축',
      '📱 전체 페이지 모바일 스마트폰 화면 UI/UX 반응형 최적화 완료'
    ]
  }
];

export default function DevNotes() {
  const bottomRef = useRef(null);

  useEffect(() => {
    // 접속하자마자 맨 아래 new 항목으로 자동 스크롤
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, []);

  return (
    <div className="w-full space-y-6 animate-fade-in font-['Plus_Jakarta_Sans','Paperlogy',sans-serif] [word-break:keep-all]">
      {/* 페이지 헤더 */}
      <div className="border-b border-[#5865f2]/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#35ed7e] animate-ping" />
            개발자 노트
          </h2>
          <p className="text-xs text-[#35ed7e] font-bold mt-1">시스템 업데이트 소식 & 데이터 알림</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#35ed7e]/20 border border-[#35ed7e]/40 text-[#35ed7e] uppercase flex items-center gap-1.5 shadow-sm">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            SYSTEM NOTIFICATIONS
          </span>
        </div>
      </div>

      {/* 노티스 카드 목록 */}
      <div className="space-y-4">
        {DEV_NOTES.map((note) => (
          <div
            key={note.id}
            ref={note.isNew ? bottomRef : null}
            className={`relative bg-[#1e2353] border rounded-2xl p-4 sm:p-6 transition-all duration-300 shadow-xl ${
              note.isNew
                ? 'border-[#35ed7e] ring-2 ring-[#35ed7e]/50 shadow-2xl shadow-[#35ed7e]/20 scale-[1.01]'
                : 'border-[#5865f2]/30 hover:border-[#5865f2]'
            }`}
          >
            {/* 상단 태그 & 날짜 & NEW 뱃지 */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-[#5865f2] text-white">
                  {note.tag}
                </span>
                {note.isNew && (
                  <span className="px-2 py-0.5 rounded-full bg-[#35ed7e] text-[#000000] text-[11px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-md shadow-[#35ed7e]/40">
                    <Sparkles className="w-3 h-3" />
                    NEW
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-white/50">{note.date}</span>
            </div>

            {/* 타이틀 */}
            <h3 className={`text-base sm:text-lg font-extrabold mb-3 ${note.isNew ? 'text-[#35ed7e]' : 'text-white'}`}>
              {note.title}
            </h3>

            {/* 항목 리스트 */}
            <ul className="space-y-2 text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              {note.content.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#23272a]/60 p-2.5 rounded-xl border border-[#5865f2]/20">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${note.isNew ? 'text-[#35ed7e]' : 'text-[#5865f2]'}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 바닥부 안내 */}
      <div className="text-center pt-2 pb-4 text-xs text-white/40 font-bold flex items-center justify-center gap-2">
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#35ed7e]" />
        <span>가장 최신 업데이트 노티스가 맨 아래에 표시됩니다</span>
      </div>
    </div>
  );
}
