import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, User, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const SUPABASE_URL = "https://tuqwintstnimajksseir.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cXdpbnRzdG5pbWFqa3NzZWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMjM5OTEsImV4cCI6MjEwMDc5OTk5MX0.EhvBzznSEbf9WgWabcA6Sfx4Qfz5-7Sw_1rRzPFaJO8";

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchEntries = async (showLoading = true) => {
    if (showLoading) setIsFetching(true);
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

      let remoteEntries = [];
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          remoteEntries = data.map((item, idx) => {
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
              page_id: item.page_id || "yuyeon_special",
              nickname: item.nickname || item.name || item.writer || "익명",
              content: item.content || item.message || item.text || "",
              created_at: new Date(timestamp).toISOString(),
            };
          });
        }
      }

      remoteEntries.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });

      setEntries(remoteEntries);
    } catch (err) {
      console.error("방명록 로딩 오류:", err);
      setErrorMsg("방명록 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      if (showLoading) setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchEntries(true);
    const interval = setInterval(() => {
      fetchEntries(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

    setEntries((prev) => [newEntry, ...prev]);

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
      setSuccessMsg("방명록이 등록되었습니다!");
      fetchEntries(false);

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

  return (
    <div className="w-full max-w-2xl flex flex-col items-center space-y-6 select-none">
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
          placeholder="따뜻한 응원이나 메시지를 적어주세요..."
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
          <span>{loading ? "등록 중..." : "방명록 남기기"}</span>
        </button>
      </form>

      {/* Refresh Toolbar */}
      <div className="w-full flex items-center justify-between px-2 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          총 <strong className="text-white">{entries.length}</strong>개의 메시지
        </span>
        <button
          onClick={() => fetchEntries(true)}
          className="flex items-center gap-1 hover:text-white transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-purple-400' : ''}`} />
          새로고침
        </button>
      </div>

      {/* Message List */}
      <div className="w-full space-y-3">
        {entries.length === 0 && !isFetching ? (
          <div className="text-center py-12 text-white/40 text-sm bg-[#18181b]/50 border border-white/5 rounded-2xl">
            아직 방명록이 없습니다. 첫 메시지를 남겨보세요!
          </div>
        ) : (
          entries.map((entry, idx) => (
            <div
              key={entry.id || idx}
              className="bg-[#18181b] border border-white/5 p-4 rounded-xl space-y-2 hover:border-purple-500/30 transition shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 text-sm">{entry.nickname}</span>
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
