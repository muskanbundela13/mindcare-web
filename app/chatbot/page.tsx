"use client";

import { useState, useEffect, useRef } from "react";

const API = "https://mindcare-backend-8tzt.onrender.com";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isCrisis?: boolean;
}

const HELPLINES = [
  { name: "iCall", number: "9152987821" },
  { name: "Vandrevala", number: "1860-2662-345" },
];

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi 👋 I'm MindCare AI.\n\nI'm here to listen without judgment. How are you feeling today?",
  timestamp: new Date(),
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);
  const [helplines, setHelplines] = useState(HELPLINES);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        role: "assistant",
        content: data?.data?.response || "No response",
        timestamp: new Date(),
        isCrisis: data?.data?.isCrisis,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data?.data?.isCrisis) {
        setIsCrisis(true);
        setHelplines(data?.data?.helplines || HELPLINES);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection issue. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="h-screen flex flex-col bg-[#0F1117] text-white">

      {/* Header */}
      <div className="p-3 border-b border-white/10 text-sm font-semibold">
        🧠 MindCare Chat
      </div>

      {/* Crisis */}
      {isCrisis && (
        <div className="p-3 text-red-400 text-xs border-b border-red-500/20">
          ⚠️ Please contact help:
          <div className="flex gap-2 mt-2 flex-wrap">
            {helplines.map((h) => (
              <a
                key={h.name}
                href={`tel:${h.number}`}
                className="px-3 py-1 bg-red-500/10 rounded"
              >
                {h.name}: {h.number}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600"
                  : msg.isCrisis
                  ? "bg-red-500/20"
                  : "bg-white/10"
              }`}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-gray-500 mt-1">
              {formatTime(msg.timestamp)}
            </span>
          </div>
        ))}

        {loading && (
          <div className="text-xs text-gray-400">Typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 px-3 py-2 rounded outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}