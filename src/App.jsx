import React, { useState, useEffect } from 'react';
import MiniRoom from './components/MiniRoom';
import Guestbook from './components/Guestbook';
import { Home, Sparkles, Music, Gamepad2, Heart, MessageSquare, ArrowLeft, RotateCcw, RefreshCw } from 'lucide-react';
import NavBar from './components/NavBar';

const BACK_SUMMER_IMAGE = "https://raw.githubusercontent.com/nanarinnn/yuyeon_special/main/image/back_summer.png";

const CARD_FLIP_ITEMS = [
  { id: 1, title: 'Summer Special #1', orientation: 'vertical', frontImageUrl: 'https://raw.githubusercontent.com/nanarinnn/yuyeon_special/main/image/front1_summer.png', backImageUrl: BACK_SUMMER_IMAGE },
  { id: 2, title: 'Summer Special #2', orientation: 'vertical', frontImageUrl: 'https://raw.githubusercontent.com/nanarinnn/yuyeon_special/main/image/front2_summer.png', backImageUrl: BACK_SUMMER_IMAGE },
  { id: 3, title: 'Summer Special #3', orientation: 'horizontal', frontImageUrl: 'https://raw.githubusercontent.com/nanarinnn/yuyeon_special/main/image/front3_summer.png', backImageUrl: BACK_SUMMER_IMAGE },
  { id: 4, title: 'Summer Special #4', orientation: 'horizontal', frontImageUrl: 'https://raw.githubusercontent.com/nanarinnn/yuyeon_special/main/image/front4_summer.png', backImageUrl: BACK_SUMMER_IMAGE },
  { id: 5, title: 'Summer Special #5', orientation: 'horizontal', frontImageUrl: 'https://raw.githubusercontent.com/nanarinnn/yuyeon_special/main/image/front5_summer.png', backImageUrl: BACK_SUMMER_IMAGE },
  { id: 6, title: 'Summer Special #6', orientation: 'horizontal', frontImageUrl: 'https://raw.githubusercontent.com/nanarinnn/yuyeon_special/main/image/front6_summer.png', backImageUrl: BACK_SUMMER_IMAGE },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWork, setSelectedWork] = useState(null);

  // Card Flip Game State
  const [cards, setCards] = useState(
    CARD_FLIP_ITEMS.map((item) => ({ ...item, isFlipped: false }))
  );

  const toggleFlip = (id) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  };

  const flipAll = (status) => {
    setCards((prev) => prev.map((card) => ({ ...card, isFlipped: status })));
  };

  // 페이지를 벗어나면 카드 전부 초기화(뒷면)
  useEffect(() => {
    if (activeTab !== 'flip') {
      setCards(CARD_FLIP_ITEMS.map((item) => ({ ...item, isFlipped: false })));
    }
  }, [activeTab]);

  const menuItems = [
    { id: 'work', label: '작품/캐릭터 추천', desc: '나나링이 좋아하는 작품/캐릭터 소개', icon: Sparkles, gradient: 'from-purple-600/30 to-indigo-600/30 border-purple-500/40 text-white' },
    { id: 'flip', label: '카드 뒤집기', desc: '특별 포토 카드 뒤집기 미니게임', icon: Gamepad2, gradient: 'from-pink-600/30 to-rose-600/30 border-pink-500/40 text-pink-300' },
    { id: 'todaymusic', label: '오늘의 추천곡', desc: '나나링의 애정하는 곡들을 풀어보아요', icon: Music, gradient: 'from-cyan-600/30 to-blue-600/30 border-cyan-500/40 text-cyan-300' },
    { id: 'miniroom', label: '미니룸 3D', desc: '입체적이고 아기자기한 3D 카페', icon: Heart, gradient: 'from-fuchsia-600/30 to-purple-600/30 border-fuchsia-500/40 text-fuchsia-300' },
    { id: 'visit', label: '방명록', desc: '유연에게 전하는 메세지', icon: MessageSquare, gradient: 'from-amber-600/30 to-orange-600/30 border-amber-500/40 text-amber-300' },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e12] text-white flex flex-col items-center selection:bg-purple-500 selection:text-white font-normal">
      {/* Top Navigation Bar */}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} setSelectedWork={setSelectedWork} />

      {/* Main Container */}
      <main className="w-full max-w-5xl px-3 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">

        {/* === HOME === */}
        {activeTab === 'home' && (
          <div className="w-full flex flex-col items-center gap-8 sm:gap-12 animate-fade-in">
            <div className="text-center space-y-2 pt-6 sm:pt-10">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                YUYEON ONLY
              </h1>
              <p className="text-xs sm:text-sm font-light tracking-widest text-white/60 uppercase">
                YUYEON ARCHIVE
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative bg-gradient-to-br ${item.gradient} border rounded-2xl p-4 sm:p-5 text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl`}
                  >
                    <Icon className="w-5 h-5 mb-2 opacity-80" />
                    <h3 className="text-sm sm:text-base font-bold text-white">{item.label}</h3>
                    <p className="text-[11px] text-white/60 mt-0.5 font-normal">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* === CHARACTER RECOMMENDATION LIST === */}
        {activeTab === 'work' && !selectedWork && (
          <div className="w-full space-y-6 sm:space-y-8 animate-fade-in">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">작품/캐릭터 추천</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* 사의찬미 */}
              <div 
                onClick={() => setSelectedWork('gloomyday')}
                className="group bg-[#1c1c2e] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-950 transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src="/workimage/work1.png" alt="사의찬미" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c2e] via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-3">
                  <span className="text-xs font-semibold text-white/70">뮤지컬</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">뮤지컬 사의찬미 "사내"</h3>
                </div>
              </div>

              {/* 프리스트 */}
              <div 
                onClick={() => setSelectedWork('priest')}
                className="group bg-[#1c1c2e] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-950 transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src="/workimage/priest.png" alt="프리스트" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c2e] via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-3">
                  <span className="text-xs font-semibold text-white/70">뮤지컬</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">뮤지컬 프리스트</h3>
                </div>
              </div>

              {/* 마마 돈 크라이 */}
              <div 
                onClick={() => setSelectedWork('mamadontcry')}
                className="group bg-[#1c1c2e] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-950 transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src="/mamadontcry/poster_mom.png" alt="마마돈크라이" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c2e] via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-3">
                  <span className="text-xs font-semibold text-white/70">뮤지컬</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">뮤지컬 마마 돈 크라이</h3>
                </div>
              </div>

              {/* COMING SOON */}
              <div className="group bg-[#1c1c2e] border border-dashed border-white/20 rounded-2xl overflow-hidden cursor-default select-none">
                <div className="relative aspect-[3/4] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                  <span className="text-3xl">✦</span>
                  <span className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">Coming Soon</span>
                </div>
                <div className="p-3">
                  <span className="text-xs font-semibold text-white/20">뮤지컬</span>
                  <h3 className="text-sm font-bold text-white/20 mt-0.5">준비 중이에요</h3>
                  <p className="text-xs text-white/20 mt-0.5">곧 새로운 작품을 소개할게요!</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* WORK DETAIL: 사의찬미 */}
        {activeTab === 'work' && selectedWork === 'gloomyday' && (
          <div className="w-full space-y-6 animate-fade-in">
            <button 
              onClick={() => setSelectedWork(null)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#1c1c2e] hover:bg-white/10 rounded-xl text-xs sm:text-sm font-semibold border border-white/10 transition"
            >
              <ArrowLeft className="w-4 h-4" /> 뒤로가기
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              {/* 왼쪽 영역: 포스터 및 영상 */}
              <div className="md:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/workimage/work1.png" alt="사의찬미 포스터" className="w-full" />
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-white mt-4">공연 영상</h3>
                <div className="bg-[#1c1c2e] p-3 rounded-2xl border border-white/10 space-y-4">
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/c8geRDQQn9c?si=_DpuhyX6jeV2xmvK" title="사의찬미 영상1" allowFullScreen />
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/lte99dPuK6s?si=W9HUGh011oveb8lM" title="사의찬미 영상2" allowFullScreen />
                </div>
              </div>

              {/* 오른쪽 영역: 작품 정보 */}
              <div className="md:col-span-7 space-y-6">
                <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">"우린 새로운 세상으로 갈거야, 준비됐어?"</h1>
                
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터 목록</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/woojin.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="김우진" />
                      <div className="font-bold text-xs sm:text-sm">김우진</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배우: 주민진)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/simdeock.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="윤심덕" />
                      <div className="font-bold text-xs sm:text-sm">윤심덕</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배우: 안유진)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/sanae.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="사내" />
                      <div className="font-bold text-xs sm:text-sm">사내</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배우: 정민)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품/캐릭터 소개</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-2 font-normal">
                    <p>"1926년 8월 4일 새벽 4시, 관부연락선 도쿠주마루.<br/>한 여자와 남자가 바다로 몸을 던진다." (공연 中)</p>
                    <p>천재 극작가 김우진, 조선의 소프라노 윤심덕, 그리고 그 둘을 잇는 사내.<br/>김우진 and 사내는 한 편의 희곡을 쓴다. 희곡의 결말은 어땠을까?</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">나나링의 작품에 대한 사담</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>사내라는 캐릭터는 굉장히 매력적이지만, 배우로서는 표현하기 힘든 캐릭터라고 생각해.<br/>이 작품을 쓴 작가도 모를 만큼, 無에서 有를 만드는 캐릭터이니까.<br/>하지만, 작품이 지금까지 공연되었다는 건, <br/>이 캐릭터를 만들어가며, 연기하는 배우들도 매력을 느낀다는 이야기가 아닐까 싶어.</p>
                    <p>희곡의 원래 결말은 "윤심덕이 김우진을 총으로 쏜다, 그리고 윤심덕도 머리에 총을 겨누며 자살을 한다"<br/>하지만, 우진과 심덕은 자아를 찾아서 결국 관부연락선에서 투신을 해.<br/>사내는 자아를 찾아가는 둘에게 분노를 표하며, 둘을 죽이려고 하지만, 결국 실패하고 말아.</p>
                    <p>마지막은 사내가 허탈한 듯 변해버린 희곡의 결말을 읽으며 극은 끝나.<br/>둘의 행복한 모습이 담긴 결말을 말이야.<br/>사내는 자신의 목표를 위해 둘을 이용했지만, 자신의 목표를 이루지 못한 채,<br/>결국 쓸쓸한 결말을 맞이해.<br/>사내는 참 매력적이기도 하지만, 어떻게 보면 외로움의 형상 그 자체라고 볼 수도 있을지도?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* WORK DETAIL: 프리스트 */}
        {activeTab === 'work' && selectedWork === 'priest' && (
          <div className="w-full space-y-6 animate-fade-in">
            <button 
              onClick={() => setSelectedWork(null)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#1c1c2e] hover:bg-white/10 rounded-xl text-xs sm:text-sm font-semibold border border-white/10 transition"
            >
              <ArrowLeft className="w-4 h-4" /> 뒤로가기
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              {/* 왼쪽 영역: 포스터 및 오디오 */}
              <div className="md:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/workimage/priest.png" alt="프리스트 포스터" className="w-full" />
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-white">넘버를 들어보자!</h3>
                <div className="bg-[#1c1c2e] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-2.5">
                  <div className="p-2.5 bg-[#0e0e12] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">구마의식</span>
                    <audio controls className="h-8 w-full sm:w-44 filter invert"><source src="/audio/02 구마의식.mp3" /></audio>
                  </div>
                  <div className="p-2.5 bg-[#0e0e12] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">태생 5품</span>
                    <audio controls className="h-8 w-full sm:w-44 filter invert"><source src="/audio/11 태생 5품(REP.).mp3" /></audio>
                  </div>
                  <div className="p-2.5 bg-[#0e0e12] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">파문의 악몽</span>
                    <audio controls className="h-8 w-full sm:w-44 filter invert"><source src="/audio/14 파문의 악몽(REP.).mp3" /></audio>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">공연 영상</h3>
                <div className="bg-[#1c1c2e] p-3 rounded-2xl border border-white/10">
                  <iframe 
                    className="w-full h-[320px] sm:h-[480px] rounded-xl" 
                    src="https://platform.twitter.com/embed/Tweet.html?id=1249506650525970432&theme=dark" 
                    title="프리스트 트위터 영상" 
                    allowFullScreen 
                  />
                </div>
              </div>

              {/* 오른쪽 영역: 텍스트 설명 및 유튜브 영상 */}
              <div className="md:col-span-7 space-y-6">
                <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">"신의 선택을 받은 자"</h1>
                
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터 목록</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/marco.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="마르코" />
                      <div className="font-bold text-xs sm:text-sm">마르코</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배우: 기세중)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/yohan.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="요한" />
                      <div className="font-bold text-xs sm:text-sm">요한</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배우: 백기범)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/yujeong.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="서유정" />
                      <div className="font-bold text-xs sm:text-sm">서유정</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배우: 이지숙)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/bar.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="바텐더" />
                      <div className="font-bold text-xs sm:text-sm">바텐더</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배우: 최호승)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품 소개</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                    "신부님, 악마는 실제로 존재하나요?"(공연 中)<br/>
                    신자의 질문에 마르코는 과거로 돌아가 떠올린다. 과거의 마르코에게는 어떤 일이 있었을까?
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품에 대한 대략적인 이야기</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>이 작품은 진정한 오컬트라고 볼 수 있을 것 같아.<br/>난 배우님 때문에 보게 되었지만, 어쩌다 보니 다른 배우님에 치이게 되는 계기가 되었던 작품이기도 해.</p>
                    <p>극의 첫 시작은 마르코가 신자에게 질문을 받으며 시작해. 그리고는 과거를 회상하는 듯이 극이 시작되지.</p>
                    <p>마르코는 원래 사제였지만, 과거 구마예식에서 문제를 일으켰다는 이유로 파문 돼. 그리고는 의대생인 요한과 함께 야매(?) 구마예식을 하러 다니지. <br/>그 그렇게 다니던 중, 마르코는 기이한 기운을 느껴. 평소에 경험하던 악마들과는 다른 느낌.</p>
                    <p>그렇게 하루하루 보내던 나날 중, 요한의 어머니(무당)가 정신병원에서 하나의 의뢰를 받아. 요한은 어머니를 따라 정신병원으로 가게 되고, 마르코는 그걸 말리려고 했지만, 결국 말리지는 못해.</p>
                    <p>정신병원에 있던 환자 "서유정"은 이미 악마에게 빙의된 채, 요한을 끌어들이고, 결국 마르코도 정신병원으로 오게 만들어. 그리고는 마르코의 과거를 보여주며, 마르코를 고통으로 끌어들이지. 마르코가 과거에 파문되었던 그 날을 보여주며 말이야.</p>
                    <p>마르코는 어릴 때부터 성당에서 지냈는데, 그 성당의 신부님이 구마예식을 하면서 죽고, 그 옆에 있던 가브리엘라 수녀 또한 죽어. 수녀의 죽음에는 수녀가 원했다는 정당한 이유가 있었지만, 마르코는 여전히, 그녀의 죽음이 자신의 잘못이라고 생각하며, 그날의 기억에서 헤어나오지 못한 채 계속 묶여서 지내고 있었던 거야.</p>
                    <p>그 기억에 또 다시 잠식되어 가던 찰나, 베드로(=바텐더)가 극적으로 나타나서는 마르코를 구하며, 결국 마르코, 베드로, 요한이 함께 구마를 성공적으로 완료하게 돼. 그 일을 계기로 마르코는 정식 사제가 되고 극은 끝나.</p>
                    <p>여담으로는 극에서는 "666"이라는 숫자를 중요하게 여기는 듯이 나오는데, 그 숫자가 악마의 숫자라나 뭐라나..</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터와 배우에 대한 나나링의 사담</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>캐릭터 자체는 매력적인가.. 글쎄. 잘 모르겠어. 소재 자체는 엄청나게 매력적이라고 생각해. 대학로에서도 '구마'라는 소재를 가진 작품은 찾기 힘들었으니까.<br/>생각보다 캐릭터 하나하나가 촘촘하게 만들어져 있어.</p>
                    <p>'마르코'는 어린 시절의 기억 속에 사로잡혀 나오지 못하지만, 결국 자신의 의지와 타인의 도움으로 자신을 옭아매고 있던 끈을 끊어내지.</p>
                    <p>'요한'은 현실에서는 의대생이라는 타이틀을 가지고 있지만, 무당인 엄마의 영향으로, 요한도 귀신을 보며 결국 학업에도 영향을 받게 돼. (극의 마지막에는 아마.. 의사가 결국 됐던 걸로 기억하는데.) 귀신을 본다는 이유로 어릴 적부터 놀림을 받지만, 결국 마지막에는 1인분을 하며 지내게 돼.</p>
                    <p>'서유정'은 어릴 적, 발레를 하며 다른 캐릭터에 비해 나은 생활을 보냈지만, 아버지의 죽음으로 모든 것이 망가져 결국 정신병원에 입원, 악마에게 빙의되며 결국 구마를 당하게 돼. 하지만, 그녀가 구마 되던 그 순간, 그녀의 모습은 그 어디에서도 볼 수 없는 평온한 모습이야.</p>
                    <p>'바텐더'는 평범한 바의 바텐더처럼 밝은 모습의 캐릭터야. 이 극에서 볼 수 있는 유일한.. 밝은 캐릭터라고 생각해. 마지막 부분에서 마르코의 끈을 끊게 도와주는 인물이기도 하고.</p>
                    <p>'서유정'과 '바텐더'역의 배우들은 1인 2역을 소화하게 돼. 작품 설명에 나온 '서유정'과 '바텐더', 그리고 '악마'. 난 이 극을 보면서 '서유정'역의 배우들을 꽤 많이 좋아했어. 정말.. 멋있다고 느꼈거든. 내가 왜 그렇게 느꼈는지는, 영상을 보면 알 수 있을지도?</p>
                    <p>극을 보다 보면 가끔 이해가 안 될 때도 있어. 하지만, 그 부분에 대해 한번 쯤 복기하며 생각해보는 극도 나름의 즐거움이 있다고 생각해.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">당시의 실제 공연 영상</h3>
                  <div className="bg-[#1c1c2e] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/8AyD-_tuzW0" title="실제 공연 영상1" allowFullScreen />
                      <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/wd_HKnjSvhY" title="실제 공연 영상2" allowFullScreen />
                    </div>
                    <p className="text-center text-xs text-white/50 mt-2">* 내 영상을 쓰게 될줄은 몰랐다;;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORK DETAIL: 마마 돈 크라이 */}
        {activeTab === 'work' && selectedWork === 'mamadontcry' && (
          <div className="w-full space-y-6 animate-fade-in">
            <button 
              onClick={() => setSelectedWork(null)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#1c1c2e] hover:bg-white/10 rounded-xl text-xs sm:text-sm font-semibold border border-white/10 transition"
            >
              <ArrowLeft className="w-4 h-4" /> 뒤로가기
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              <div className="md:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/mamadontcry/poster_mom.png" alt="마마돈크라이 포스터" className="w-full" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">공연 영상</h3>
                <div className="bg-[#1c1c2e] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3">
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/KHM3aG4-6uo?si=Lh2awoJbc5K8YFFR" title="마마돈크라이 영상1" allowFullScreen />
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/yxSik0s1QcM?si=nvJeNma6tGVa8OXk" title="마마돈크라이 영상2" allowFullScreen />
                </div>
              </div>

              <div className="md:col-span-7 space-y-6">
                <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">"영원히 끝나지 않을 사랑과 죽음을 건 두 남자의 이야기!"</h1>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품 소개</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                    "사랑 받고 싶다면, 사랑에 빠지지 마." (공연 中)<br/>
                    매력 있는 남자가 되고 싶어, 드라큘라 백작을 만나기 위해 1456년, 루마니아로 떠난 프로페서 V.<br/>
                    그곳에서 프로페서 V는 원하는 것을 얻을 수 있었을까?
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품에 대한 대략적인 이야기</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>나나링의 최애작품 1위를 차지한 그 작품! 뮤지컬 "마마 돈 크라이" 되시겠습니다.</p>
                    <p>어릴 적부터 천재라 불리우며, 13살에 박사학위를 받고, 물리학 교수로 임용된 프로페서 V, 하지만 그에게는 치명적인 결점이 있었으니, 바로 "매력이 없다". 그래서 자신이 좋아했던 메텔(은하철도 999 맞음)에게 고백도 차이고 말아.</p>
                    <p>그렇게 매력에 대해 고민을 하던 그에게, 하나의 잡지가 배달돼. 잡지의 이름은 "월간 뱀파이어".<br/>
                    그 잡지를 읽은 그는, 1456년에 존재했다는 드라큘라 백작을 만나기 위해, 타임머신을 만들어 시간여행을 떠나게 되지.
                    타임머신을 타고 간 루마니아에서는, 드라큘라 백작을 만나 매력을 배워. 정확하게 말하면 "같은 뱀파이어"가 돼.</p>
                    <p>드라큘라 백작이 V(편의상 V)를 뱀파이어로 만들며 말해. "사랑 받고 싶다면, 사랑에 빠지지 마"라고. 이 의미를 V는 후반부에 가서야 깨닫게 돼.</p>
                    <p>V는 뱀파이어가 되는 댓가로 매력을 얻었지만, 피의 갈망에서 벗어나지 못해. 그리고 결국은 V가 사랑했던 메텔의 목을 물어 죽이고는 그 말의 의미를 깨닫게 되지. V는 그녀를 살리겠다는 일념으로 과거로 다시 돌아가, 그녀를 살리고는 미련이 없다는 듯이 공간을 빠져나와.</p>
                    <p>캐릭터에 대한 자세한 이야기는 아래에서 만나보자!</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터에 대한 이야기</h3>
                  <div className="space-y-4">
                    {/* 프로페서 V */}
                    <div className="bg-[#1c1c2e] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start font-normal">
                      <img src="/mamadontcry/professor.png" alt="프로페서 V" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0" />
                      <div className="space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                        <h4 className="font-bold text-sm sm:text-base text-white">프로페서 V (배우: 송용진)</h4>
                        <p>매력을 배우고 싶었던 순수한 소년. 하지만, 드라큘라 백작을 만나며 그의 인생은 송두리 째 바뀌어.</p>
                        <p>사랑하는 여자(메텔)를 위해 인생을 바쳤지만, 결국 그녀를 살리기 위해 사랑을 포기해. 극 초반에는 굉장히 활기차고 발랄한 캐릭터로 보이지만, 극 후반으로 갈수록 점점 피폐해지는 그의 모습을 볼 수 있어.</p>
                        <p>당시 이 역을 맡았던 송용진 배우님은, 전 작품에서 멘탈이 갈리는 작품을 하고 와서 "이번 작품은 B급 작품이겠지~"하면서 왔는데, 전 작품만큼 멘탈이 갈리는 작품이었다는 평가.</p>
                        <p>그만큼 감정의 소모가 심한 작품이었다고 해. 밝은 캐릭터를 연기하다가 순식간에 정반대의 면모를 보이며, 인간의 절망이 어디까지인지를 표현하기 때문이 아니었을까 싶어.</p>
                      </div>
                    </div>

                    {/* 드라큘라 백작 */}
                    <div className="bg-[#1c1c2e] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start font-normal">
                      <img src="/mamadontcry/vamp.png" alt="드라큘라 백작" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0" />
                      <div className="space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                        <h4 className="font-bold text-sm sm:text-base text-white">드라큘라 백작 (배우: 고영빈)</h4>
                        <p>겉으로는 매력적인 캐릭터이지만, 그 나름대로 또 고민을 가지고 있지.<br/><br/>"불멸의 삶을 끝내고 싶다."</p>
                        <p>그 불멸의 삶을 끝내 줄 사람이 V였던거야. 그래서, 백작은 V에게 "월간 뱀파이어"를 보내고, 나비의 형태로 V의 곁에 머물며 그를 지켜보며, V가 자신에게 오도록 의도했어.</p>
                        <p>결국 백작은 V를 같은 뱀파이어로 만들고, 자신을 죽이게 만들어. 죽음에 닿는 데에는 성공했지만, V가 타임머신을 타고 과거로 회귀하는 바람에, 결국 그는 다시 살아나.</p>
                        <p>첫 장면과 마지막 장면에는 기자가 V에게 질문을 하는 장면이 나오는데, 그 기자가 누구인지는, 적지 않아도 알겠지?</p>
                        <p>극의 마지막은 V와 백작이 손을 맞잡으며 끝나.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품에 대한 나나링의 사담</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>나나링이 무려 10년 이상 좋아한 작품, 이 작품이 계기가 되어 뮤지컬에 푹 빠지게 되었어.</p>
                    <p>뱀파이어라는 소재를 매우 좋아했던(지금도 좋아함) 나나링은 이 작품을 10번 정도 본 것 같아.</p>
                    <p>초연 당시에는, 두 사람이 나오지만, 한 사람이 극의 90%를 이끌어갔다고 해. 지금의 작품은 초연의 "멀티맨"의 캐릭터 중 하나인 "드라큘라 백작"을 하나의 캐릭터로 만들어서, 2013년 2인극으로 개편한 작품이야. 난 2인극일 때만 봤고, 2인극일 때 훨씬 인기를 많이 끈 작품이야.</p>
                    <p>프로페서 V라는 캐릭터를 연기하는 배우들은 정말 고생을 많이 해. 100분짜리 극에서, 30분 가량을 혼자 이끌어 가. (하지만 인기는 백작 역의 배우들이 다 끌어간다고.. 읍읍)</p>
                    <p>캐릭터 자체도 마냥 밝은 캐릭터는 아니고, 100분 안에 감정을 극과 극으로 끌어간다는 게 쉽지만은 않다고 생각하는데, 배우라는 직업은 정말 대단한 것 같아.</p>
                    <p>난 소재 때문에 좋아했지만, 10년 이상 사랑 받은 데에는 아마 다른 이유도 있을거라고 생각해. 개인적으로는 배우들의 연기와, 음악이 아닐까 싶어. 매력적인 캐릭터도 있겠지만..</p>
                    <p>인외 소재라서 추천을 할까말까.. 고민을 많이했어. 근데 다음 추천작도 인외물입니다 ^^</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === CARD FLIP GAME === */}
        {activeTab === 'flip' && (
          <div className="w-full flex flex-col items-center space-y-6 sm:space-y-8 animate-fade-in select-none">
            {/* Action Toolbar */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => flipAll(true)}
                className="px-4 py-2 text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>전체 뒤집기</span>
              </button>
              <button
                onClick={() => flipAll(false)}
                className="px-4 py-2 text-xs font-bold bg-[#1c1c2e] text-white border border-white/10 hover:border-purple-400 rounded-xl flex items-center gap-1.5 active:scale-95 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>원상복구</span>
              </button>
            </div>

            {/* 6 Cards Grid
                - 뒤집기 전: 세로 비율(80:50 ≈ 8:5) 유지
                - 가로형 카드 뒤집힌 후: 가로 비율(80:50 → 가로 display)로 전환
                - object-contain으로 이미지 잘림 방지 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-3xl">
              {cards.map((card) => {
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleFlip(card.id)}
                    className="cursor-pointer perspective aspect-[4/5]"
                  >
                    <div className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${card.isFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Front face – 뒷면 디자인(클릭 전 보이는 면) */}
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-purple-500/40 backface-hidden shadow-xl hover:border-purple-400 transition bg-[#1c1c2e] flex items-center justify-center">
                        <img src={card.backImageUrl} alt="Back" className="w-full h-full object-contain" />
                      </div>
                      {/* Back face – 실제 카드 사진(뒤집힌 후 보이는 면) */}
                      <div className="absolute inset-0 bg-[#12121a] border-2 border-pink-500/50 rounded-xl sm:rounded-2xl overflow-hidden backface-hidden rotate-y-180 shadow-2xl flex items-center justify-center p-2">
                        <img src={card.frontImageUrl} alt={card.title} className="w-full h-full object-contain rounded-lg" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === TODAY'S MUSIC === */}
        {activeTab === 'todaymusic' && (
          <div className="w-full space-y-5 animate-fade-in">
            {/* 페이지 헤더 */}
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">오늘의 추천곡</h2>
              <p className="text-xs text-white/40 mt-1">나나링의 애정하는 곡들을 풀어보아요</p>
            </div>

            {/* 3열 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 기존 추천곡 */}
              <div className="bg-[#1c1c2e] border border-white/10 rounded-2xl p-3 shadow-2xl space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/CQFh1nwEsKs"
                    title="오늘의 추천곡"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-center text-white">
                  뮤지컬 '스토리 오브 마이 라이프', 나비
                </h3>
              </div>

              {/* COMING SOON 1 */}
              <div className="bg-[#1c1c2e] border border-dashed border-white/20 rounded-2xl p-3 shadow-xl">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20 flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl">✦</span>
                  <span className="text-xs font-bold tracking-[0.25em] text-white/30 uppercase">Coming Soon</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-center text-white/20 mt-3">
                  다음 추천곡 준비 중
                </h3>
              </div>

              {/* COMING SOON 2 */}
              <div className="bg-[#1c1c2e] border border-dashed border-white/20 rounded-2xl p-3 shadow-xl">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20 flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl">✦</span>
                  <span className="text-xs font-bold tracking-[0.25em] text-white/30 uppercase">Coming Soon</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-center text-white/20 mt-3">
                  다음 추천곡 준비 중
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* === 3D MINIROOM === */}
        {activeTab === 'miniroom' && <MiniRoom />}

        {/* === GUESTBOOK === */}
        {activeTab === 'visit' && <Guestbook />}

      </main>

      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-white/40 font-normal">
        © YUYEON ONLY. All rights reserved.
      </footer>
    </div>
  );
}
