"use client";
// ═══════════════════════════════════════════════
// MODULE 7 — WELLNESS TOOLS
// File: app/wellness/page.tsx
// ═══════════════════════════════════════════════
import { useState } from "react";
const API = "https://mindcare-app-nine.vercel.app";
const USER_ID = "user_demo_001";

const MEDITATIONS = [
  { id: 1, title: "Morning Calm", duration: 5, type: "Mindfulness", icon: "🌅", color: "#3B6FE8" },
  { id: 2, title: "Anxiety Relief", duration: 10, type: "Breathing", icon: "🌬️", color: "#7C3AED" },
  { id: 3, title: "Deep Sleep", duration: 20, type: "Sleep", icon: "🌙", color: "#0891B2" },
  { id: 4, title: "Body Scan", duration: 15, type: "Relaxation", icon: "💆", color: "#059669" },
  { id: 5, title: "Stress Relief", duration: 8, type: "Breathing", icon: "🍃", color: "#D97706" },
  { id: 6, title: "Self-Compassion", duration: 12, type: "Mindfulness", icon: "💛", color: "#DC2626" },
];

export default function Wellness() {
  const [tab, setTab] = useState("meditation");
  const [sleepLog, setSleepLog] = useState({ sleepAt: "", wakeAt: "", qualityScore: 3, notes: "" });
  const [gratitude, setGratitude] = useState("");
  const [breathPhase, setBreathPhase] = useState("");
  const [breathing, setBreathing] = useState(false);
  const [saved, setSaved] = useState("");

  async function saveSleep() {
    await fetch(`${API}/api/sleep`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, ...sleepLog }) });
    setSaved("Sleep log saved! ✅"); setTimeout(() => setSaved(""), 3000);
  }

  async function saveGratitude() {
    if (!gratitude.trim()) return;
    await fetch(`${API}/api/gratitude`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, content: gratitude }) });
    setGratitude(""); setSaved("Gratitude saved! ✅"); setTimeout(() => setSaved(""), 3000);
  }

  async function logMeditation(item: any) {
    await fetch(`${API}/api/meditation`, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, durationMinutes: item.duration, type: item.type }) });
    setSaved(`${item.title} completed! ✅`); setTimeout(() => setSaved(""), 3000);
  }

  function startBreathing() {
    setBreathing(true);
    const phases = ["Inhale... (4s)", "Hold... (4s)", "Exhale... (4s)", "Hold... (4s)"];
    let i = 0;
    const interval = setInterval(() => {
      setBreathPhase(phases[i % 4]);
      i++;
      if (i >= 16) { clearInterval(interval); setBreathing(false); setBreathPhase("Complete! 🌟"); }
    }, 4000);
    setBreathPhase(phases[0]);
  }

  const S: Record<string, any> = {
    page: { fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh" },
    tabs: { background: "#1A1A2E", display: "flex", gap: 4, padding: "0 40px" },
    tab: (a: boolean) => ({ padding: "13px 20px", background: "none", border: "none", borderBottom: a ? "3px solid #3B6FE8" : "3px solid transparent", color: a ? "#60A5FA" : "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    content: { maxWidth: 1000, margin: "0 auto", padding: "32px 40px" },
    card: { background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E8E8F0", marginBottom: 16 },
    btn: (c = "#3B6FE8") => ({ padding: "10px 22px", background: c, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    input: { padding: "10px 14px", border: "2px solid #E8E8F0", borderRadius: 8, fontSize: 13, outline: "none" },
  };

  return (
    <div style={S.page}>
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#0F3460)", padding: "40px", color: "#fff" }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8 }}>🌱 Wellness & Prevention Tools</h1>
        <p style={{ color: "#94A3B8" }}>Daily tools to maintain and improve your mental wellbeing</p>
      </div>
      <div style={S.tabs}>
        {[["meditation","🧘 Meditation"],["breathing","🌬️ Breathing"],["sleep","😴 Sleep"],["gratitude","🙏 Gratitude"]].map(([key, label]) => (
          <button key={key} style={S.tab(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      <div style={S.content}>
        {saved && <div style={{ background: "#DCFCE7", color: "#16A34A", padding: "10px 16px", borderRadius: 8, fontWeight: 600, marginBottom: 16, fontSize: 14 }}>{saved}</div>}

        {tab === "meditation" && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Guided Meditations</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {MEDITATIONS.map(m => (
                <div key={m.id} style={{ ...S.card, borderTop: `4px solid ${m.color}` }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{m.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>{m.type} · {m.duration} min</div>
                  <button style={{ ...S.btn(m.color), width: "100%" }} onClick={() => logMeditation(m)}>▶ Start</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "breathing" && (
          <div style={{ ...S.card, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🌬️ Box Breathing</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 32 }}>4 rounds of box breathing — inhale, hold, exhale, hold — each for 4 seconds</p>
            {breathing || breathPhase ? (
              <div>
                <div style={{ width: 160, height: 160, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", transition: "all 4s ease-in-out" }}>
                  {breathPhase}
                </div>
                {!breathing && <button style={{ ...S.btn(), width: "100%" }} onClick={startBreathing}>Start Again</button>}
              </div>
            ) : (
              <button style={{ ...S.btn(), width: "100%", padding: "16px", fontSize: 16 }} onClick={startBreathing}>Start Breathing Exercise</button>
            )}
          </div>
        )}

        {tab === "sleep" && (
          <div style={S.card}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>😴 Log Your Sleep</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>BEDTIME</label>
                <input type="datetime-local" style={{ ...S.input, width: "100%" }} value={sleepLog.sleepAt} onChange={e => setSleepLog(s => ({ ...s, sleepAt: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>WAKE TIME</label>
                <input type="datetime-local" style={{ ...S.input, width: "100%" }} value={sleepLog.wakeAt} onChange={e => setSleepLog(s => ({ ...s, wakeAt: e.target.value }))} />
              </div>
            </div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8, display: "block" }}>SLEEP QUALITY: {["","😞","😟","😐","🙂","😄"][sleepLog.qualityScore]}</label>
            <input type="range" min={1} max={5} value={sleepLog.qualityScore} onChange={e => setSleepLog(s => ({ ...s, qualityScore: Number(e.target.value) }))}
              style={{ width: "100%", accentColor: "#3B6FE8", marginBottom: 16 }} />
            <button style={{ ...S.btn(), width: "100%" }} onClick={saveSleep}>Save Sleep Log</button>
          </div>
        )}

        {tab === "gratitude" && (
          <div style={S.card}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🙏 Gratitude Journal</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 20 }}>Research shows that writing 3 things you're grateful for daily significantly improves mood over time.</p>
            <textarea style={{ width: "100%", padding: "14px", borderRadius: 10, border: "2px solid #E8E8F0", fontSize: 14, fontFamily: "sans-serif", minHeight: 150, outline: "none", resize: "vertical" as const }}
              placeholder="Today I'm grateful for..." value={gratitude} onChange={e => setGratitude(e.target.value)} />
            <button style={{ ...S.btn(), width: "100%", marginTop: 16 }} onClick={saveGratitude}>Save Gratitude Entry</button>
          </div>
        )}
      </div>
    </div>
  );
}
