"use client";
import { useState, useEffect, useRef } from "react";

const API = "https://mindcare-app-nine.vercel.app";
const SESSION = `session_${Math.random().toString(36).substr(2, 9)}`;

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hi there 👋 I'm here to listen and support you. How are you feeling today? You can share anything — this is a safe, judgment-free space." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: SESSION, message: userMsg })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.data.response }]);
        if (data.data.isCrisis) setIsCrisis(true);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. If you need immediate support, please call iCall at 9152987821." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#0F3460)", padding: "20px 32px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧠</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>MindCare Support</div>
          <div style={{ color: "#34D399", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399", display: "inline-block" }}></span>
            Available 24/7
          </div>
        </div>
        <a href="tel:9152987821" style={{ marginLeft: "auto", background: "#DC2626", color: "#fff", padding: "8px 16px", borderRadius: 10, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
          🆘 Crisis Helpline
        </a>
      </div>

      {/* CRISIS BANNER */}
      {isCrisis && (
        <div style={{ background: "#FEE2E2", border: "2px solid #DC2626", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>🆘</span>
          <div>
            <div style={{ fontWeight: 700, color: "#DC2626" }}>We're concerned about you</div>
            <div style={{ fontSize: 13, color: "#7F1D1D" }}>Please call iCall: <strong>9152987821</strong> or Vandrevala: <strong>1860-2662-345</strong></div>
          </div>
        </div>
      )}

      {/* DISCLAIMER */}
      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", padding: "10px 24px", fontSize: 12, color: "#92400E" }}>
        ⚠️ This chatbot provides emotional support only — it is not a substitute for professional mental health care.
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 800, width: "100%", margin: "0 auto" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 12, alignItems: "flex-end" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🧠</div>
            )}
            <div style={{
              maxWidth: "70%", padding: "14px 18px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "linear-gradient(135deg,#3B6FE8,#7C3AED)" : "#fff",
              color: msg.role === "user" ? "#fff" : "#1A1A2E",
              fontSize: 14, lineHeight: 1.6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: msg.role === "assistant" ? "1px solid #E8E8F0" : "none"
            }}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E8E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👤</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧠</div>
            <div style={{ background: "#fff", border: "1px solid #E8E8F0", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", fontSize: 20, color: "#94A3B8" }}>
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* QUICK PROMPTS */}
      <div style={{ padding: "0 32px 12px", maxWidth: 800, width: "100%", margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["I'm feeling anxious", "I can't sleep well", "I feel lonely", "I need to talk"].map(prompt => (
          <button key={prompt} onClick={() => setInput(prompt)}
            style={{ padding: "7px 14px", background: "#fff", border: "2px solid #E8E8F0", borderRadius: 20, fontSize: 13, color: "#475569", cursor: "pointer" }}>
            {prompt}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div style={{ background: "#fff", borderTop: "1px solid #E8E8F0", padding: "16px 32px", maxWidth: 800, width: "100%", margin: "0 auto", display: "flex", gap: 12, alignItems: "flex-end" }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
          placeholder="Type a message... (Press Enter to send)"
          style={{ flex: 1, padding: "12px 16px", borderRadius: 14, border: "2px solid #E8E8F0", fontSize: 14, fontFamily: "sans-serif", resize: "none", outline: "none", maxHeight: 120, minHeight: 48 }}
          rows={1}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          style={{ padding: "12px 20px", background: input.trim() ? "linear-gradient(135deg,#3B6FE8,#7C3AED)" : "#E8E8F0", color: input.trim() ? "#fff" : "#94A3B8", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 18, cursor: "pointer", flexShrink: 0 }}>
          ➤
        </button>
      </div>
    </div>
  );
}
