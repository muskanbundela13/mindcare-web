"use client";
// ============================================================
// MindCare — Complete AI Chatbot
// File: app/chatbot/page.tsx
// Features:
//   ✅ Claude AI with CBT/DBT framework
//   ✅ Crisis detection + helpline escalation
//   ✅ Session memory (conversation history)
//   ✅ Voice input (Web Speech API — free, no API key)
//   ✅ Anonymous mode
//   ✅ Mood check-in
//   ✅ Smart suggestions
//   ✅ Typing indicator
//   ✅ Message timestamps
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

const API = "https://hackathonproject-production-a9d1.up.railway.app";

// ── TYPES ──────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isCrisis?: boolean;
}

interface Helpline {
  name: string;
  number: string;
  hours: string;
}

// ── CONSTANTS ──────────────────────────────────────────────────
const HELPLINES: Helpline[] = [
  { name: "iCall", number: "9152987821", hours: "Mon-Sat 8am-10pm" },
  { name: "Vandrevala Foundation", number: "1860-2662-345", hours: "24/7" },
  { name: "NIMHANS", number: "080-46110007", hours: "Mon-Sat 9am-5pm" },
];

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hi there 👋 I'm MindCare's AI support assistant, trained in CBT and DBT principles.\n\nI'm here to listen without judgment and support you through whatever you're facing. Everything you share is confidential.\n\nHow are you feeling today?",
  timestamp: new Date(),
};

// ── VOICE HOOK ─────────────────────────────────────────────────
function useVoiceInput(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-IN";

        recognitionRef.current.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          onResult(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [onResult]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  return { isListening, isSupported, toggleListening };
}

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const [sessionToken] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [showMoodCheck, setShowMoodCheck] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([
    "I'm feeling anxious today",
    "I can't sleep well",
    "I feel overwhelmed",
    "I need someone to talk to",
    "I'm feeling lonely",
    "How can I manage stress?"
  ]);
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, isSupported, toggleListening } = useVoiceInput((text) => {
    setInput(prev => prev + text);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── SEND MESSAGE ──────────────────────────────────────────────
  async function sendMessage(text?: string) {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setInput("");
    setSuggestions([]);

    const userMsg: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionToken,
          userName: isAnonymous ? undefined : userName,
          isAnonymous,
          mood: mood || undefined
        })
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsg: Message = {
          role: "assistant",
          content: data.data.response,
          timestamp: new Date(),
          isCrisis: data.data.isCrisis
        };

        setMessages(prev => [...prev, assistantMsg]);

        if (data.data.isCrisis) {
          setIsCrisis(true);
          setHelplines(data.data.helplines || HELPLINES);
        }

        if (data.data.suggestions?.length) {
          setSuggestions(data.data.suggestions);
        }
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. If you need immediate support, please call iCall at 9152987821.",
        timestamp: new Date()
      }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  const MOOD_EMOJIS = ["", "😞", "😟", "😕", "😐", "😶", "🙂", "😊", "😄", "🤩", "🌟"];

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0F1117", height: "100dvh", display: "flex", flexDirection: "column", color: "#E2E8F0" }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 100%)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, boxShadow: "0 0 20px rgba(59,111,232,0.4)" }}>🧠</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>MindCare AI Support</div>
          <div style={{ fontSize: 11, color: "#34D399", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", display: "inline-block", boxShadow: "0 0 6px #34D399" }}></span>
            CBT & DBT trained · Available 24/7
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setShowNameInput(!showNameInput)}
            style={{ background: isAnonymous ? "rgba(255,255,255,0.08)" : "rgba(59,111,232,0.2)", border: "1px solid rgba(255,255,255,0.12)", color: isAnonymous ? "#94A3B8" : "#60A5FA", padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
            {isAnonymous ? "👤 Anonymous" : `👋 ${userName || "Named"}`}
          </button>
          <a href="tel:9152987821" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#F87171", padding: "5px 12px", borderRadius: 20, fontWeight: 600, fontSize: 11, textDecoration: "none" }}>
            🆘 Crisis
          </a>
        </div>
      </div>

      {/* ── NAME INPUT PANEL ───────────────────────────────── */}
      {showNameInput && (
        <div style={{ background: "#1C2030", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 20px", display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <input
            placeholder="Your name (optional)"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 14px", color: "#E2E8F0", fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={() => { setIsAnonymous(!userName); setShowNameInput(false); }}
            style={{ background: "#3B6FE8", border: "none", borderRadius: 10, padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {userName ? "Save" : "Stay Anonymous"}
          </button>
        </div>
      )}

      {/* ── MOOD CHECK-IN ──────────────────────────────────── */}
      {showMoodCheck && (
        <div style={{ background: "linear-gradient(135deg,rgba(59,111,232,0.1),rgba(124,58,237,0.1))", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 20px", flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8, fontWeight: 600 }}>HOW ARE YOU FEELING RIGHT NOW?</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} onClick={() => { setMood(n); setShowMoodCheck(false); }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: mood === n ? "2px solid #3B6FE8" : "1px solid rgba(255,255,255,0.1)", background: mood === n ? "rgba(59,111,232,0.3)" : "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#E2E8F0", fontWeight: 600 }}>
                {n}
              </button>
            ))}
            <button onClick={() => setShowMoodCheck(false)}
              style={{ background: "none", border: "none", color: "#475569", fontSize: 12, cursor: "pointer", marginLeft: 4 }}>
              Skip
            </button>
          </div>
          {mood && <div style={{ fontSize: 12, color: "#60A5FA", marginTop: 6 }}>Mood noted: {MOOD_EMOJIS[mood]} {mood}/10</div>}
        </div>
      )}

      {/* ── CRISIS BANNER ─────────────────────────────────── */}
      {isCrisis && (
        <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", margin: "8px 16px", borderRadius: 12, padding: "14px 16px", flexShrink: 0 }}>
          <div style={{ fontWeight: 700, color: "#F87171", marginBottom: 10, fontSize: 14 }}>🆘 Please reach out for immediate support:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(helplines.length ? helplines : HELPLINES).map(h => (
              <a key={h.name} href={`tel:${h.number}`}
                style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#FCA5A5", padding: "7px 14px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                📞 {h.name}: {h.number}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── DISCLAIMER ────────────────────────────────────── */}
      <div style={{ background: "rgba(251,191,36,0.05)", borderBottom: "1px solid rgba(251,191,36,0.1)", padding: "7px 20px", fontSize: 11, color: "#92400E", flexShrink: 0, color: "#D97706" }}>
        ⚠️ AI support only — not a substitute for professional care. In crisis? Call 112.
      </div>

      {/* ── MESSAGES ──────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 4 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", maxWidth: "80%" }}>
              {msg.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, boxShadow: "0 0 12px rgba(59,111,232,0.3)" }}>🧠</div>
              )}
              <div style={{
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg,#3B6FE8,#7C3AED)"
                  : msg.isCrisis
                    ? "rgba(220,38,38,0.15)"
                    : "rgba(255,255,255,0.06)",
                border: msg.role === "assistant" ? `1px solid ${msg.isCrisis ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.08)"}` : "none",
                fontSize: 14,
                lineHeight: 1.65,
                color: msg.role === "user" ? "#fff" : "#E2E8F0",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                  {isAnonymous ? "👤" : userName[0]?.toUpperCase() || "👤"}
                </div>
              )}
            </div>
            <div style={{ fontSize: 10, color: "#374151", paddingLeft: msg.role === "assistant" ? 40 : 0, paddingRight: msg.role === "user" ? 40 : 0 }}>
              {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}

        {/* TYPING INDICATOR */}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🧠</div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#60A5FA", opacity: 0.7, animation: `pulse 1.4s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── SUGGESTIONS ───────────────────────────────────── */}
      {suggestions.length > 0 && !loading && (
        <div style={{ padding: "6px 16px 6px", display: "flex", gap: 7, overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => sendMessage(s)}
              style={{ padding: "7px 14px", background: "rgba(59,111,232,0.1)", border: "1px solid rgba(59,111,232,0.25)", borderRadius: 20, fontSize: 12, color: "#60A5FA", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── INPUT AREA ────────────────────────────────────── */}
      <div style={{ background: "#141720", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>

        {/* VOICE BUTTON */}
        {isSupported && (
          <button onClick={toggleListening}
            style={{ width: 42, height: 42, borderRadius: "50%", border: `2px solid ${isListening ? "#F87171" : "rgba(255,255,255,0.1)"}`, background: isListening ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", animation: isListening ? "pulse-border 1s infinite" : "none" }}
            title={isListening ? "Stop listening" : "Voice input"}>
            {isListening ? "🔴" : "🎤"}
          </button>
        )}

        {/* TEXT INPUT */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
          placeholder={isListening ? "🎤 Listening..." : "Type a message... (Enter to send, Shift+Enter for new line)"}
          rows={1}
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "11px 16px", color: "#E2E8F0", fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", maxHeight: 120, lineHeight: 1.5, transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "rgba(59,111,232,0.5)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />

        {/* SEND BUTTON */}
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: input.trim() ? "linear-gradient(135deg,#3B6FE8,#7C3AED)" : "rgba(255,255,255,0.06)", color: input.trim() ? "#fff" : "#374151", cursor: input.trim() ? "pointer" : "not-allowed", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: input.trim() ? "0 0 16px rgba(59,111,232,0.4)" : "none" }}>
          ➤
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(248,113,113,0); }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
