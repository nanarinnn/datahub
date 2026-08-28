import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, User, RefreshCw, AlertCircle, CheckCircle2, Calendar, Cloud, Database } from 'lucide-react';

const SUPABASE_URL = "https://tuqwintstnimajksseir.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cXdpbnRzdG5pbWFqa3NzZWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMjM5OTEsImV4cCI6MjEwMDc5OTk5MX0.EhvBzznSEbf9WgWabcA6Sfx4Qfz5-7Sw_1rRzPFaJO8";

export default function Guestbook() {
  const [entries2026, setEntries2026] = useState([]);
  const [entries2027, setEntries2027] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedYear, setSelectedYear] = useState("2027");

  // 1. Google Cloud Server (GCS) 데이터 로딩 (2026년 롤링페이퍼 아카이브)
  const fetch2026Entries = async () => {
    try {
      let remoteData = null;
      try {
        const res = await fetch("/api/gcs/rolling-paper-2026");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) remoteData = json;
        }
      } catch (e) {}

      if (!remoteData) {
        const res = await fetch("/rolling_paper_2026.json");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json)) remoteData = json;
        }
      }

      if (Array.isArray(remoteData)) {
        const formatted = remoteData.map((item, idx) => {
          let timestamp = Date.now();
          if (item.page_id && item.page_id.startsWith("yuyeon_special_")) {
            const parsedTs = parseInt(item.page_id.replace("yuyeon_special_", ""), 10);
            if (!isNaN(parsedTs)) timestamp = parsedTs;
          } else if (item.created_at) {
            const parsedDate = new Date(item.created_at).getTime();
            if (!isNaN(parsedDate)) timestamp = parsedDate;
          }

          return {
            id: item.id || timestamp + idx,
            nickname: item.nickname || item.name || item.writer || "익명",
            content: item.content || item.message || item.text || "",
            created_at: new Date(timestamp).toISOString(),
            source: "Google Cloud Server (GCS)",
          };
        });

        formatted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setEntries2026(formatted);
      }
    } catch (err) {
      console.error("2026 구글 클라우드 서버 데이터 불러오기 오류:", err);
    }
  };

  // 2. Supabase Cloud DB 데이터 로딩 (2027년 수신 데이터)
  const fetch2027Entries = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/guestbook?select=*`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((item, idx) => {
            let timestamp = Date.now();
            if (item.page_id && item.page_id.startsWith("yuyeon_special_")) {
              const parsedTs = parseInt(item.page_id.replace("yuyeon_special_", ""), 10);
              if (!isNaN(parsedTs)) timestamp = parsedTs;
            } else if (item.created_at) {
              const parsedDate = new Date(item.created_at).getTime();
              if (!isNaN(parsedDate)) timestamp = parsedDate;
            }

            return {
              id: item.id || timestamp + idx,
              nickname: item.nickname || item.name || item.writer || "익명",
              content: item.content || item.message || item.text || "",
              created_at: new Date(timestamp).toISOString(),
              source: "Supabase DB",
            };
          });

          formatted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setEntries2027(formatted);
        }
      }
    } catch (err) {
      console.error("2027 Supabase 데이터 불러오기 오류:", err);
    }
  };

  const fetchAllData = async (showLoading = true) => {
    if (showLoading) setIsFetching(true);
    await Promise.all([fetch2026Entries(), fetch2027Entries()]);
    if (showLoading) setIsFetching(false);
  };

  useEffect(() => {
    fetchAllData(true);
    const interval = setInterval(() => {
      fetchAllData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 3. 2027년 신규 방명록 작성 (Supabase DB 전송)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg("이름과 작성 내용을 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const nowTs = Date.now();
    const newEntry = {
      page_id: `yuyeon_special_${nowTs}`,
      nickname: name.trim(),
      content: message.trim(),
      created_at: new Date(nowTs).toISOString(),
    };

    // UI 즉시 반영 (2027년 리스트)
    setEntries2027((prev) => [
      { ...newEntry, id: nowTs, source: "Supabase DB" },
      ...prev,
    ]);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) {
        throw new Error("서버 저장 실패");
      }

      setMessage("");
      setSuccessMsg("2027년 방명록이 Supabase 서버에 등록되었습니다!");
      setSelectedYear("2027");
      fetch2027Entries();

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.error("저장 실패:", err);
      setErrorMsg("서버 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${year}.${month}.${day} ${hours}:${mins}`;
    } catch (e) {
      return "";
    }
  };

  const allEntries = [...entries2027, ...entries2026];
  const displayedEntries =
    selectedYear === "2026"
      ? entries2026
      : selectedYear === "2027"
      ? entries2027
      : allEntries;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center space-y-6 select-none">
      {/* 페이지 헤더 (중앙 정렬) */}
      <div className="border-b border-[#a855f7]/30 pb-4 flex flex-col items-center justify-center text-center gap-2.5 w-full">
        <div className="flex items-center justify-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#a855f7] animate-pulse shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">유연 방명록</h2>
        </div>
        <p className="text-xs sm:text-sm text-purple-300 font-bold">유연에게 전하는 따뜻한 응원과 마음</p>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#a855f7] uppercase flex items-center gap-1.5 shadow-sm">
          <MessageSquare className="w-3.5 h-3.5" />
          GUESTBOOK ARCHIVE
        </span>
      </div>

      {/* 2026 (Google Cloud) / 2027 (Supabase) 연도별 탭 선택기 */}
      <div className="w-full max-w-full grid grid-cols-3 gap-1 sm:gap-2 p-1.5 bg-[#18181b] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setSelectedYear("2026")}
          className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
            selectedYear === "2026"
              ? "bg-[#a855f7] text-white shadow-lg shadow-purple-500/30 scale-[1.02]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Cloud className="w-3.5 h-3.5 text-blue-300 shrink-0" />
          <span className="truncate">2026년 (GCS)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] sm:text-[10px] font-bold text-white shrink-0">
            {entries2026.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedYear("2027")}
          className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
            selectedYear === "2027"
              ? "bg-[#a855f7] text-white shadow-lg shadow-purple-500/30 scale-[1.02]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span className="truncate">2027년 (Supa)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] sm:text-[10px] font-bold text-white shrink-0">
            {entries2027.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedYear("all")}
          className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            selectedYear === "all"
              ? "bg-purple-900/60 text-purple-200 border border-purple-500/40"
              : "text-white/40 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="truncate">전체 ({allEntries.length})</span>
        </button>
      </div>

      {/* 현재 선택된 서버 정보 인포 배너 */}
      <div className="w-full px-3 py-2.5 bg-[#18181b]/80 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 text-[11px] sm:text-xs text-white/80 [word-break:keep-all]">
        <div className="flex items-center justify-center gap-1.5 font-semibold flex-wrap">
          {selectedYear === "2026" && (
            <>
              <Cloud className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>☁️ 구글 클라우드 서버 (GCS) 보존 데이터</span>
            </>
          )}
          {selectedYear === "2027" && (
            <>
              <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>⚡ Supabase Cloud DB 실시간 작성 데이터</span>
            </>
          )}
          {selectedYear === "all" && (
            <>
              <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>🌐 전체 서버 (GCS + Supabase) 통합 보기</span>
            </>
          )}
        </div>
        <span className="text-[10px] sm:text-[11px] text-purple-300 font-bold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
          {selectedYear === "2026"
            ? "🔒 보안 보존 아카이브"
            : selectedYear === "2027"
            ? "⚡ 실시간 작성 가능"
            : "🌐 통합 연동"}
        </span>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#18181b] border border-white/10 p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xl"
      >
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-xs text-green-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="relative">
          <User className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="작성자 닉네임"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#09090b] border border-white/10 rounded-xl text-sm text-[#ffffff] placeholder-white/40 focus:outline-none focus:border-purple-500 transition"
            maxLength={20}
          />
        </div>

        <textarea
          placeholder="2027년 따뜻한 응원이나 메시지를 적어주세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 px-4 py-3 bg-[#09090b] border border-white/10 rounded-xl text-sm text-[#ffffff] placeholder-white/40 focus:outline-none focus:border-purple-500 transition resize-none"
          maxLength={300}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#a855f7] hover:bg-[#c084fc] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? "등록 중..." : "2027년 방명록 남기기 (Supabase DB)"}</span>
        </button>
      </form>

      {/* Refresh Toolbar */}
      <div className="w-full flex items-center justify-between px-2 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          {selectedYear === "all"
            ? `총 ${allEntries.length}개의 메시지 (Google Cloud: ${entries2026.length}개 / Supabase: ${entries2027.length}개)`
            : `${selectedYear}년 메시지 (${displayedEntries.length}개)`}
        </span>
        <button
          onClick={() => fetchAllData(true)}
          className="flex items-center gap-1 hover:text-white transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-purple-400' : ''}`} />
          새로고침
        </button>
      </div>

      {/* Message List */}
      <div className="w-full space-y-3">
        {displayedEntries.length === 0 && !isFetching ? (
          <div className="text-center py-12 text-white/40 text-sm bg-[#18181b]/50 border border-white/5 rounded-2xl">
            {selectedYear === "2026"
              ? "구글 클라우드 서버 2026년 방명록 데이터가 없습니다."
              : selectedYear === "2027"
              ? "Supabase 2027년 방명록 메시지가 아직 없습니다. 첫 메시지를 남겨보세요!"
              : "아직 방명록이 없습니다."}
          </div>
        ) : (
          displayedEntries.map((entry, idx) => (
            <div
              key={entry.id || idx}
              className="bg-[#18181b] border border-white/5 p-4 rounded-xl space-y-2 hover:border-purple-500/30 transition shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-300 text-sm">{entry.nickname}</span>
                  {entry.source === "Google Cloud Server (GCS)" && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                      <Cloud className="w-3 h-3" /> GCS
                    </span>
                  )}
                  {entry.source === "Supabase DB" && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Database className="w-3 h-3" /> Supabase
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-white/40">{formatDate(entry.created_at)}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
