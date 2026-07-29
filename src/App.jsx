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
    { id: 'work', label: '캐릭터 추천', desc: '나나링이 좋아하는 작품/캐릭터 소개', icon: Sparkles, gradient: 'from-purple-600/30 to-indigo-600/30 border-purple-500/40 text-white' },
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white">캐릭터 추천</h2>
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
                  <p className="text-xs text-white/60 mt-0.5">작품과 캐릭터를 모두 만나보자!</p>
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
                  <p className="text-xs text-white/60 mt-0.5">작품과 캐릭터를 모두 만나보자!</p>
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
              <div className="md:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/workimage/work1.png" alt="사의찬미" className="w-full" />
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-white mt-4">공연 영상</h3>
                <div className="bg-[#1c1c2e] p-3 rounded-2xl border border-white/10 space-y-3">
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/c8geRDQQn9c?si=_DpuhyX6jeV2xmvK" title="video1" allowFullScreen />
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/lte99dPuK6s?si=W9HUGh011oveb8lM" title="video2" allowFullScreen />
                </div>
              </div>

              <div className="md:col-span-7 space-y-6">
                <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">"죽방 새로운 세상으로 떠나볼까, 준비됐지?"</h1>
                
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터 목록</h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/woojin.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="우진혁" />
                      <div className="font-bold text-xs sm:text-sm">우진혁</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배역명: 강윤호)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/simdeock.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="심덕" />
                      <div className="font-bold text-xs sm:text-sm">심덕</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배역명: 윤심덕)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2.5 sm:p-3 rounded-xl text-center border border-white/5">
                      <img src="/workimage/sanae.png" className="w-full aspect-square object-cover rounded-lg mb-2" alt="사내" />
                      <div className="font-bold text-xs sm:text-sm">사내</div>
                      <div className="text-[10px] sm:text-xs text-white/50">(배역명: 유연)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품/캐릭터 소개</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-2 font-normal">
                    <p>"1926년 8월 4일 현해탄 4시 연락선에서의 비극적인 사건"<br/>"사의찬미는 실화를 바탕으로 만들어진 작품이다." (공연 안내)</p>
                    <p>열정적 성격의 우진혁, 현실과 이상 사이의 심덕, 현실적이고 자유로운 사내.<br/>우진혁과 사내는 서로 대비되는 인물이다. 인물들의 갈등이 흥미롭다.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">나나링의 작품에 대한 사담</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>사내라는 캐릭터가 이번 작품에서의 배역명으로서의 매력이 엄청난 캐릭터라고 생각해.<br/>이 작품에서 보여주는 모습은 자유롭고, 거칠며, 세상을 만나보는 캐릭터인데.<br/>작품 자체가 공연 영상에서도 볼 수 있듯 캐릭터가 만나보며 이야기를 풀어가는 배역명은 정말 매력적인 캐릭터야.</p>
                    <p>인물들이 서로 갈등이 "심덕에게 우진혁의 사랑이 부담스럽고, 현실적인 심덕에는 이상적인 사랑이 부담스럽다."<br/>작품에서 사내는 이런 관계에서 자유로운 존재로 대비되고 그 속에서 사내의 매력이 더욱 드러난다.<br/>사내가 이런 관계를 통해 작품 속에서 자신만의 색을 표현하는 것이 굉장히 인상적이다.<br/>과연 사내라는 캐릭터의 마무리는 어떻게 되는지.. 궁금하다면 공연 영상을 통해 확인해보자. 멋진 작품이다!</p>
                    <p>사내라는 캐릭터의 매력은 작품 안에서 자유롭고 거침없는 모습으로 관객에게 강한 인상을 남긴다.<br/>사내가 보여주는 자유로운 면모는 작품 전체의 분위기를 더욱 풍성하게 만들어준다.</p>
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
              <div className="md:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/workimage/priest.png" alt="프리스트" className="w-full" />
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

                <h3 className="text-base sm:text-lg font-bold text-white">당시의 실제 공연 영상</h3>
                <div className="bg-[#1c1c2e] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/8AyD-_tuzW0" title="video1" allowFullScreen />
                    <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/wd_HKnjSvhY" title="video2" allowFullScreen />
                  </div>
                  <p className="text-center text-xs text-white/50 mt-1">* 일부 영상은 외부 링크입니다;</p>
                </div>
              </div>

              <div className="md:col-span-7 space-y-6">
                <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">"신의 심판을 받아라!"</h1>
                
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터 목록</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-[#1c1c2e] p-2 rounded-xl text-center border border-white/5">
                      <img src="/workimage/marco.png" className="w-full aspect-square object-cover rounded-lg mb-1" alt="마르코" />
                      <div className="font-bold text-xs">마르코</div>
                      <div className="text-[10px] text-white/50">(배역명: 김유연)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2 rounded-xl text-center border border-white/5">
                      <img src="/workimage/yohan.png" className="w-full aspect-square object-cover rounded-lg mb-1" alt="요한" />
                      <div className="font-bold text-xs">요한</div>
                      <div className="text-[10px] text-white/50">(배역명: 박세환)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2 rounded-xl text-center border border-white/5">
                      <img src="/workimage/yujeong.png" className="w-full aspect-square object-cover rounded-lg mb-1" alt="유정" />
                      <div className="font-bold text-xs">유정</div>
                      <div className="text-[10px] text-white/50">(배역명: 정유정)</div>
                    </div>
                    <div className="bg-[#1c1c2e] p-2 rounded-xl text-center border border-white/5">
                      <img src="/workimage/bar.png" className="w-full aspect-square object-cover rounded-lg mb-1" alt="바르톨로" />
                      <div className="font-bold text-xs">바르톨로</div>
                      <div className="text-[10px] text-white/50">(배역명: 신동욱)</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품 소개</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                    "악령에게 점령된 마르코를 구해야 한다!"(공연 안내)<br/>신부인 요한과 마르코의 구마의식을 그려내고 있습니다. 구마의식과 마르코라는 캐릭터 사이 이야기가 굉장히 몰입감 있습니다.
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품에 대한 대략적인 이야기</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>이 작품은 요한의 사제로서의 삶과 마르코의 구마의식이 교차하며 전개됩니다. 각 배역명의 연기력이 작품의 몰입감을 높이고 있어요.</p>
                    <p>현재 유정은 마르코와 신부 요한 사이에서 갈등하며, 유정이 현실적인 구마의식을 그려내며 현실적으로 유정이 성장합니다.</p>
                    <p>마르코의 변화와 구마의식 과정이 인상적이며, 요한과의 관계에서 보여주는 갈등이 작품의 핵심입니다. 현실적이고 깊이 있는 이야기를 담고 있습니다.</p>
                    <p>현실적으로 조금씩 변화하며 요한의 신앙과의 갈등이 심화되는 과정이 매우 인상적입니다. 마르코의 내면의 변화와 요한의 신앙 사이의 균형이 이 작품의 매력입니다.</p>
                    <p>구마의식의 과정 속에서 마르코가 어떻게 변화하는지, 요한이 신앙과 현실 사이에서 어떤 선택을 하는지가 이 작품의 핵심적인 감동 포인트입니다.</p>
                    <p>현실적으로 이야기를 풀어가면서도 뮤지컬 특유의 음악적 표현이 돋보이는 작품으로, 각 넘버마다 캐릭터의 감정이 깊이 있게 전달됩니다.</p>
                    <p>특히 바르톨로와 요한의 관계, 유정과의 삼각 구도가 작품의 긴장감을 높이며, 마르코의 구마의식이 클라이맥스를 향해 치달을수록 관객의 몰입도가 극대화됩니다.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터와 배우에 대한 나나링의 사담</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>캐릭터의 매력이 대단해.. 정말 모든 것이 완벽했다. 특히 매력적으로 표현되는 배역명이 작품 속에서 빛나고 있었다. 꼭 관람해보세요. 캐릭터가 정말로 살아있는 느낌이 들어서 좋았다.</p>
                    <p><strong>'마르코'</strong>는 정말 유정이, 바르톨로 같은 사이에서 갈등하며 성장하는 인상적인 캐릭터야. 이런 캐릭터를 연기할 수 있는 배우가 정말 대단해.</p>
                    <p><strong>'요한'</strong>은 신앙적이고 헌신적인 모습으로 마르코와의 구마의식에서 빛나며, 요한의 갈등과 성장이 인상 깊었어. 요한은 마지막까지 자신의 신앙을 지키려 했고 1회차부터 감동이었어.</p>
                    <p><strong>'유정'</strong>은 정말 감정 표현이 풍부하고 배역에 완벽히 몰입하여 관객에게 감동을 전달하며, 구마의식의 과정 속에서 유정이 보여주는 성장이 인상적이었어.</p>
                    <p><strong>'바르톨로'</strong>는 감정적인 바르톨로라는 배역에 잘 어울리는 배역이었다. 이 캐릭터는 관객에게 강렬한 인상을 남겨. 배역에 완전히 몰입하여 마르코와의 대립 장면에서 빛났다.</p>
                    <p>'유정'과 '바르톨로'는 배역명이 2명인데 이 작품 전체에서 '유정'과 '바르톨로', 현실적인 '심덕'. 세 명의 캐릭터가 각자의 매력을 발산한다. 정말.. 멋진 작품이었다. 감동해서 눈물이 났다. 이 작품은 꼭 관람하길 추천한다!</p>
                    <p>현재 관람 후에도 "666"이라는 숫자에 반응하게 되는 인상적인.. 작품이다. 그 숫자를 보면 숫자가 이렇게 의미를 가질 수 있다는 것이 놀랍다.</p>
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
                  <img src="/mamadontcry/poster_mom.png" alt="마마돈크라이" className="w-full" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">공연 영상</h3>
                <div className="bg-[#1c1c2e] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3">
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/KHM3aG4-6uo?si=Lh2awoJbc5K8YFFR" title="video1" allowFullScreen />
                  <iframe className="w-full aspect-video rounded-xl" src="https://www.youtube.com/embed/yxSik0s1QcM?si=nvJeNma6tGVa8OXk" title="video2" allowFullScreen />
                </div>
              </div>

              <div className="md:col-span-7 space-y-6">
                <h1 className="text-xl sm:text-3xl font-bold text-white leading-snug">"영원히 잊지 못할 사랑과 슬픔의 이야기를 만나보자"</h1>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품 소개</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                    "사랑 때문에 울지마, 사랑이 찾아올 거야" (공연 안내)<br/>
                    과거 한 왕국의 비극적인 이야기, 왕비와 왕세자에 대한 1456년 조선시대의 비극적인 이야기를 담은 작품 V.<br/>
                    현재에 이르는 교수와 V의 심오한 관계를 그려내는 뮤지컬.
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품에 대한 대략적인 이야기</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>나나링의 인생작품 1순위 뮤지컬 작품! 뮤지컬 "마마 돈 크라이"를 소개합니다.</p>
                    <p>정말 흥미로운 이야기 구조를 가지고, 13세기 왕실의 비극과, 현대의 교수와 뱀파이어 이야기, 그리고 그 사이를 잇는 교수 V, 그리고 "과거의 왕세자". 현실적인 묘사가 뛰어난 작품으로, 관객(라비앙로즈)이 999명밖에 되지 않는 소극장 뮤지컬입니다.</p>
                    <p>현실적이지만 그 속에서 판타지적인 요소와 교수 V의 내면을 그려내며, 교수가 왕세자 V에게 "심판을 내리겠다"에 대한 갈등과 V와의 관계가 이 작품의 핵심이에요.<br/>그 교수에게 V가, 1456년에 현대와 과거를 잇는 왕비와 왕세자에 대한 이야기로, 해방되지 못한 왕비의 슬픔을 풀어내며 교수 V가 직면하는 갈등이 이 작품의 매력입니다. 결과적으로 "심판을 내리겠다"를 통해</p>
                    <p>왕비와 V(왕세자 V)에게 내려진 심판과 교수 V가 직면하는 과거와의 대면. "사랑 때문에 울지마, 사랑이 찾아올 거야"라는 메시지. 이 작품에서 V와 교수의 관계가 풀리는 순간 관객은 깊은 감동을 받게 됩니다.</p>
                    <p>V와 내려진 심판 속에서 과거와의 화해를 통해 앞으로 나아가는 이야기가 감동적입니다. 현실적이면서도 판타지적인 요소가 어우러져, 관객에게 깊은 여운을 남기며 V가 사랑에 의해 구원받는 이야기입니다. V와 현실적으로 마주하는 모습이 인상적이며 결국 V가 찾아가는 평화로운 결말이 인상적입니다.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">캐릭터에 대한 이야기</h3>
                  <div className="space-y-4">
                    {/* 교수 V */}
                    <div className="bg-[#1c1c2e] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start font-normal">
                      <img src="/mamadontcry/professor.png" alt="교수 V" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0" />
                      <div className="space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                        <h4 className="font-bold text-sm sm:text-base text-white">교수 V (배역명: 이준혁)</h4>
                        <p>과거의 배역과의 관계가 핵심이다. 그리고 왕비와 왕세자에 대한 내용을 다루며, 현실과 과거를 넘나드는 캐릭터입니다.</p>
                        <p>사랑하는 왕녀(라비앙로즈)에 대한 왕세자의 비극적인 사건과 그 이후 현실에서의 사연을, 현재의 교수로서 과거의 기억을 마주하는 캐릭터로, 매우 복합적인 인물로 관객에게 깊은 인상을 남깁니다.</p>
                        <p>특히 유연 배우 이준혁 배역명으로, 이 작품에서의 앙상블과 이 작품의 비극적인 면이 "나의 작품은 B급의 작품이라며~"했던 말이 이 작품 자체는 앙상블과 연출의 작품이며 특히, 현실적이면서도 깊은 감정의 작품이었어요.</p>
                      </div>
                    </div>

                    {/* 왕비 */}
                    <div className="bg-[#1c1c2e] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 items-start font-normal">
                      <img src="/mamadontcry/vamp.png" alt="왕비" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0" />
                      <div className="space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                        <h4 className="font-bold text-sm sm:text-base text-white">왕비 (배역명: 김신영)</h4>
                        <p>가장 비극적인 과거를 가진 캐릭터이며 그 이야기가 매우 감동적이다. "잊을 수 없는 사랑과 슬픔이다."</p>
                        <p>그 잊을 수 없는 사랑 속에서 사랑하는 V에 대한 감정이, 현실적으로 왕비는 V에게 "심판을 내리겠다"에 대한 갈등과 V와의 관계가 결국 V의 구원으로 이어진다.</p>
                        <p>결국 왕비는 V에게 심판을 내리면서도 V를 구원하려는 마음, V가 해방되지 못한 구마의식을 통해 결국 왕비의 사랑이 드러나며 그 사랑이 V를 구원한다.</p>
                        <p>이야기에서 과거와 현재 사이를 넘나들며 V에게 진정한 사랑의 의미를 찾아가는 과정이, 관객에게 깊은 감동을 전달합니다. 현재 과거와 V는 왕비와의 관계에서 결국 화해하게 됩니다.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-white">작품에 대한 나나링의 사담</h3>
                  <div className="bg-[#1c1c2e] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-3 font-normal">
                    <p>나나링이 가장 10순위 이내에 드는 작품, 이 작품은 정말 뮤지컬 중 최고라고 생각한다! 내려진 심판의 의미에서 엄청난 감동(진짜 감동인데) 나나링이 이 작품은 10회 이상을 관람했다.</p>
                    <p>솔직히 말하면, 돈 크라이라는 제목처럼 돈 크라이가 현재 90%에 가까운 정도로 진짜 작품은 솔직히 "마마 돈 크라이"의 캐릭터 속에 "왕비"라는 캐릭터가 너무 매력적이며, 2013년 2시즌부터 해왔던 작품이야. 이 2시즌의 관극 이후, 2시즌부터는 인생작 자리에서 떠나지 않는 작품이야.</p>
                    <p>교수 V라는 캐릭터가 보여주는 배역명이 정말 김유연에 대해 100회차까지 현재까지 30회 정도 관람한 것 같아. (그리고 시즌마다 왕비 역시 배역명이 바뀌었어요. 역대) 캐릭터의 매력이 마마 특별한 캐릭터로서 100회 이상 관람에서 현재까지 계속 감동을 주는 작품이에요! 결국 추천하고 싶었기에 배역명이 주는 감동은 정말 빈틈없었다.</p>
                    <p>이 특히 연기력이 감동적이며 10순위 이내 뮤지컬 꼭 관람해보시길 바랍니다! 추천하면서도 여전히 배역명이 보여주는, 특히 그 감동의 순간은 잊을 수 없습니다. 과거를 바탕으로 캐릭터를 소개했어요. 역시 특히 이것은 추천하고 싶은 작품이야.. 매력적인 작품이에요. 그래서 꼭 추천합니다 ^^</p>
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
                const isHorizontalFlipped = card.isFlipped && card.orientation === 'horizontal';
                // 가로형 카드가 뒤집혔을 때 colspan 2 처리
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleFlip(card.id)}
                    className={`cursor-pointer perspective transition-all duration-500 ${
                      isHorizontalFlipped ? 'col-span-2 sm:col-span-1 aspect-[8/5]' : 'aspect-[4/5]'
                    }`}
                    style={{ transitionProperty: 'aspect-ratio' }}
                  >
                    <div className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${card.isFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Front face – 뒷면 디자인(클릭 전 보이는 면) */}
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-purple-500/40 backface-hidden shadow-xl hover:border-purple-400 transition bg-[#1c1c2e] flex items-center justify-center">
                        <img src={card.backImageUrl} alt="Back" className="w-full h-full object-contain" />
                      </div>
                      {/* Back face – 실제 카드 사진(뒤집힌 후 보이는 면) */}
                      <div className="absolute inset-0 bg-[#1c1c2e] border-2 border-pink-500/50 rounded-xl sm:rounded-2xl overflow-hidden backface-hidden rotate-y-180 shadow-2xl flex items-center justify-center">
                        <img src={card.frontImageUrl} alt={card.title} className="w-full h-full object-contain" />
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
