"use client";
import { useState, useEffect } from "react";

const API = "https://mindcare-app-nine.vercel.app";
const USER_ID = "user_demo_001"; // Replace with real auth user ID

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself",
  "Trouble concentrating on things",
  "Moving or speaking slowly — or being fidgety or restless",
  "Thoughts that you would be better off dead",
];

const MOOD_LABELS: Record<number, string> = {
  1: "😞 Very Low", 2: "😟 Low", 3: "😕 Below Average", 4: "😐 Slightly Low",
  5: "😶 Neutral", 6: "🙂 Okay", 7: "😊 Good", 8: "😄 Very Good",
  9: "🤩 Great", 10: "🌟 Excellent"
};

export default function Assessment() {
  const [tab, setTab] = useState("mood");
  const [moodScore, setMoodScore] = useState(5);
  const [moodNotes, setMoodNotes] = useState("");
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [journalText, setJournalText] = useState("");
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [phq9Step, setPhq9Step] = useState(0);
  const [phq9Answers, setPhq9Answers] = useState<Record<number, number>>({});
  const [phq9Result, setPhq9Result] = useState<any>(null);
  const [saved, setSaved] = useState("");

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const [m, j] = await Promise.all([
        fetch(`${API}/api/mood/${USER_ID}`).then(r => r.json()),
        fetch(`${API}/api/journal/${USER_ID}`).then(r => r.json()),
      ]);
      setMoodHistory(m.data || []);
      setJournalEntries(j.data || []);
    } catch {}
  }

  async function saveMood() {
    await fetch(`${API}/api/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, moodScore, notes: moodNotes })
    });
    setSaved("Mood logged! ✅"); setMoodNotes("");
    fetchHistory(); setTimeout(() => setSaved(""), 3000);
  }

  async function saveJournal() {
    if (!journalText.trim()) return;
    await fetch(`${API}/api/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, content: journalText })
    });
    setSaved("Journal saved! ✅"); setJournalText("");
    fetchHistory(); setTimeout(() => setSaved(""), 3000);
  }

  async function submitPHQ9() {
    const res = await fetch(`${API}/api/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, type: "PHQ9", answers: phq9Answers })
    });
    const data = await res.json();
    setPhq9Result(data.data);
  }

  const S: Record<string, any> = {
    page: { fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh" },
    hero: { background: "linear-gradient(135deg,#1A1A2E,#0F3460)", padding: "40px", color: "#fff" },
    h1: { fontSize: 34, fontWeight: 800, marginBottom: 8 },
    sub: { color: "#94A3B8", fontSize: 15 },
    tabs: { background: "#1A1A2E", display: "flex", gap: 4, padding: "0 40px" },
    tab: (active: boolean) => ({ padding: "13px 20px", background: "none", border: "none", borderBottom: active ? "3px solid #3B6FE8" : "3px solid transparent", color: active ? "#60A5FA" : "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "uppercase" as const }),
    content: { maxWidth: 800, margin: "0 auto", padding: "36px 40px" },
    card: { background: "#fff", borderRadius: 18, padding: 28, border: "1px solid #E8E8F0", marginBottom: 20 },
    label: { fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8, display: "block" },
    btn: (color = "#3B6FE8") => ({ padding: "12px 28px", background: color, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }),
    textarea: { width: "100%", padding: "14px", borderRadius: 10, border: "2px solid #E8E8F0", fontSize: 14, fontFamily: "sans-serif", minHeight: 120, outline: "none", resize: "vertical" as const },
    success: { background: "#DCFCE7", color: "#16A34A", padding: "10px 16px", borderRadius: 8, fontWeight: 600, marginBottom: 16, fontSize: 14 },
  };

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h1 style={S.h1}>📊 Self-Assessment & Mood Tracking</h1>
        <p style={S.sub}>Track how you feel, journal your thoughts, and take clinical assessments</p>
      </div>

      <div style={S.tabs}>
        {[["mood","😊 Mood Log"],["journal","📓 Journal"],["phq9","📋 PHQ-9"],["history","📈 History"]].map(([key, label]) => (
          <button key={key} style={S.tab(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={S.content}>
        {saved && <div style={S.success}>{saved}</div>}

        {/* MOOD LOG */}
        {tab === "mood" && (
          <div style={S.card}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>How are you feeling today?</h2>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{MOOD_LABELS[moodScore]?.split(" ")[0]}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: "#1A1A2E" }}>{MOOD_LABELS[moodScore]?.split(" ").slice(1).join(" ")}</div>
              <input type="range" min={1} max={10} value={moodScore} onChange={e => setMoodScore(Number(e.target.value))}
                style={{ width: "100%", maxWidth: 400, accentColor: "#3B6FE8" }} />
              <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 400, margin: "0 auto", fontSize: 12, color: "#94A3B8" }}>
                <span>1 - Very Low</span><span>10 - Excellent</span>
              </div>
            </div>
            <label style={S.label}>Notes (optional)</label>
            <textarea style={S.textarea} placeholder="What's on your mind today?" value={moodNotes} onChange={e => setMoodNotes(e.target.value)} />
            <button style={{ ...S.btn(), marginTop: 16, width: "100%" }} onClick={saveMood}>Log Mood</button>
          </div>
        )}

        {/* JOURNAL */}
        {tab === "journal" && (
          <>
            <div style={S.card}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>📓 Today's Journal</h2>
              <p style={{ color: "#64748B", fontSize: 14, marginBottom: 16 }}>Write freely — your journal is private and safe</p>
              <textarea style={S.textarea} placeholder="How was your day? What are you feeling? What's been on your mind?..." value={journalText} onChange={e => setJournalText(e.target.value)} />
              <button style={{ ...S.btn(), marginTop: 16, width: "100%" }} onClick={saveJournal}>Save Entry</button>
            </div>
            {journalEntries.slice(0, 5).map((e: any) => (
              <div key={e.id} style={{ ...S.card, borderLeft: `4px solid ${e.sentiment === "positive" ? "#059669" : e.sentiment === "negative" ? "#DC2626" : "#D97706"}` }}>
                <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>{new Date(e.created_at).toLocaleDateString()}</div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{e.content}</div>
                <span style={{ fontSize: 11, background: e.sentiment === "positive" ? "#DCFCE7" : e.sentiment === "negative" ? "#FEE2E2" : "#FEF3C7", color: e.sentiment === "positive" ? "#16A34A" : e.sentiment === "negative" ? "#DC2626" : "#D97706", padding: "2px 8px", borderRadius: 12, fontWeight: 600, marginTop: 8, display: "inline-block" }}>
                  {e.sentiment}
                </span>
              </div>
            ))}
          </>
        )}

        {/* PHQ-9 */}
        {tab === "phq9" && (
          <div style={S.card}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>PHQ-9 Depression Screening</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>Over the last 2 weeks, how often have you been bothered by each problem?</p>
            {phq9Result ? (
              <div>
                <div style={{ background: "#EFF6FF", borderRadius: 14, padding: 24, textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: "#3B6FE8" }}>{phq9Result.score}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Severity: {phq9Result.severity}</div>
                  <div style={{ fontSize: 14, color: "#475569" }}>Please discuss these results with a mental health professional for proper evaluation.</div>
                </div>
                <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: 14, fontSize: 13, color: "#92400E" }}>
                  ⚠️ This is a screening tool, not a clinical diagnosis. Please consult a qualified professional.
                </div>
                <button style={{ ...S.btn("#64748B"), marginTop: 16 }} onClick={() => { setPhq9Result(null); setPhq9Step(0); setPhq9Answers({}); }}>Take Again</button>
              </div>
            ) : (
              <>
                <div style={{ background: "#F1F5F9", borderRadius: 8, padding: "8px 16px", marginBottom: 20, fontSize: 13, color: "#475569" }}>
                  Question {phq9Step + 1} of {PHQ9_QUESTIONS.length}
                  <div style={{ background: "#E2E8F0", borderRadius: 4, height: 4, marginTop: 8 }}>
                    <div style={{ background: "#3B6FE8", borderRadius: 4, height: 4, width: `${((phq9Step + 1) / PHQ9_QUESTIONS.length) * 100}%`, transition: "width 0.3s" }} />
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, lineHeight: 1.5 }}>{PHQ9_QUESTIONS[phq9Step]}</div>
                {[["0", "Not at all"],["1", "Several days"],["2", "More than half the days"],["3", "Nearly every day"]].map(([val, label]) => (
                  <button key={val} onClick={() => {
                    const updated = { ...phq9Answers, [phq9Step]: Number(val) };
                    setPhq9Answers(updated);
                    if (phq9Step < PHQ9_QUESTIONS.length - 1) setPhq9Step(s => s + 1);
                    else submitPHQ9();
                  }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 18px", marginBottom: 10, borderRadius: 10, border: "2px solid #E8E8F0", background: "#fff", fontSize: 14, cursor: "pointer" }}>
                    {label}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📈 Mood History</h2>
            {moodHistory.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", color: "#94A3B8" }}>No mood logs yet. Start logging your mood daily!</div>
            ) : moodHistory.map((m: any) => (
              <div key={m.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: m.mood_score >= 7 ? "#DCFCE7" : m.mood_score >= 4 ? "#FEF3C7" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {MOOD_LABELS[m.mood_score]?.split(" ")[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Score: {m.mood_score}/10 — {MOOD_LABELS[m.mood_score]?.split(" ").slice(1).join(" ")}</div>
                  {m.notes && <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{m.notes}</div>}
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{new Date(m.logged_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
