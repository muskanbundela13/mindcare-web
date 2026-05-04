"use client";
import { useState, useEffect } from "react";

const API = "https://mindcare-app-nine.vercel.app";

export default function EducationHub() {
  const [conditions, setConditions] = useState<any[]>([]);
  const [myths, setMyths] = useState<any[]>([]);
  const [glossary, setGlossary] = useState<any[]>([]);
  const [tab, setTab] = useState("conditions");
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(true);
  const [symptomStep, setSymptomStep] = useState(0);
  const [symptomAnswers, setSymptomAnswers] = useState<Record<number, string>>({});
  const [symptomResult, setSymptomResult] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "ta", label: "தமிழ்" },
    { code: "bn", label: "বাংলা" },
    { code: "te", label: "తెలుగు" },
  ];

  const QUESTIONS = [
    { id: 0, q: "How has your mood been for the past 2 weeks?", opts: ["Mostly good", "Ups and downs", "Mostly low", "Very low or empty"] },
    { id: 1, q: "How is your sleep?", opts: ["Sleeping well", "Occasional issues", "Often disrupted", "Very poor"] },
    { id: 2, q: "How are your energy levels?", opts: ["Normal", "Slightly tired", "Often fatigued", "Exhausted most of the time"] },
    { id: 3, q: "How much do you worry about things?", opts: ["Normal amount", "A little more than usual", "Quite a lot", "Constant, hard to control"] },
  ];

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/conditions?search=${search}&lang=${lang}`).then(r => r.json()),
      fetch(`${API}/api/myths`).then(r => r.json()),
      fetch(`${API}/api/glossary`).then(r => r.json()),
    ]).then(([c, m, g]) => {
      setConditions(c.data || []);
      setMyths(m.data || []);
      setGlossary(g.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, lang]);

  function handleAnswer(answer: string) {
    const updated = { ...symptomAnswers, [symptomStep]: answer };
    setSymptomAnswers(updated);
    if (symptomStep < QUESTIONS.length - 1) {
      setSymptomStep(s => s + 1);
    } else {
      const severeAnswers = ["Very low or empty", "Very poor", "Exhausted most of the time", "Constant, hard to control"];
      const severeCount = Object.values(updated).filter(v => severeAnswers.includes(v)).length;
      setSymptomResult(severeCount >= 2 ? "concern" : "mild");
    }
  }

  function saveOffline(slug: string) {
    setSavedItems(prev => prev.includes(slug) ? prev : [...prev, slug]);
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "13px 22px",
    background: "none",
    border: "none",
    borderBottom: active ? "3px solid #3B6FE8" : "3px solid transparent",
    color: active ? "#60A5FA" : "#64748B",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontFamily: "sans-serif",
  });

  return (
    <div style={{ fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#0F3460)", padding: "52px 40px", position: "relative", overflow: "hidden" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.1 }}>
          Your <span style={{ color: "#60A5FA" }}>Mental Health</span><br />Knowledge Centre
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 16, marginBottom: 28, maxWidth: 580, lineHeight: 1.6 }}>
          Clinically reviewed articles, symptom guides, and treatments in the language you prefer.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            style={{ flex: 1, minWidth: 260, padding: "13px 18px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, outline: "none", fontFamily: "sans-serif" }}
            placeholder="Search conditions, symptoms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ padding: "13px 14px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, cursor: "pointer", outline: "none", fontFamily: "sans-serif" }}
            value={lang}
            onChange={e => setLang(e.target.value)}
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ color: "#000" }}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#1A1A2E", display: "flex", gap: 2, padding: "0 40px", overflowX: "auto" }}>
        {[["conditions", "📚 Conditions"], ["symptoms", "🔍 Symptom Check"], ["myths", "💡 Myths & Facts"], ["glossary", "💊 Glossary"]].map(([key, label]) => (
          <button key={key} style={tabStyle(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 40px" }}>

        {loading && <p style={{ color: "#64748B" }}>Loading...</p>}

        {/* CONDITIONS */}
        {!loading && tab === "conditions" && (
          <>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Condition Library</h2>
            <p style={{ color: "#64748B", marginBottom: 28 }}>{conditions.length} conditions found</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
              {conditions.map((c: any) => (
                <div key={c.slug} style={{ background: "#fff", borderRadius: 20, padding: 26, borderTop: `4px solid ${c.color}`, border: "1px solid #E8E8F0", borderTopWidth: 4, borderTopColor: c.color, position: "relative", transition: "transform 0.2s", cursor: "pointer" }}>
                  {savedItems.includes(c.slug) && (
                    <span style={{ position: "absolute", top: 14, right: 14, background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8 }}>✓ Saved</span>
                  )}
                  <div style={{ fontSize: 34, marginBottom: 14 }}>{c.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>{c.title_hi}</div>
                  <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 18 }}>{c.description}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "9px 18px", background: c.color, color: "#fff", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}>
                      Read Articles →
                    </button>
                    <button
                      onClick={() => saveOffline(c.slug)}
                      style={{ padding: "9px 14px", background: savedItems.includes(c.slug) ? "#DCFCE7" : "#F1F5F9", color: savedItems.includes(c.slug) ? "#16A34A" : "#475569", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}>
                      {savedItems.includes(c.slug) ? "✓ Saved" : "⬇ Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SYMPTOM CHECKER */}
        {tab === "symptoms" && (
          <>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Symptom Checker</h2>
            <p style={{ color: "#64748B", marginBottom: 28 }}>Answer a few questions for an informational overview — this is NOT a medical diagnosis.</p>
            <div style={{ background: "#fff", borderRadius: 20, padding: 36, maxWidth: 580, border: "1px solid #E8E8F0" }}>
              {symptomResult ? (
                <>
                  <div style={{ background: symptomResult === "concern" ? "#EFF6FF" : "#F0FDF4", border: `2px solid ${symptomResult === "concern" ? "#BFDBFE" : "#BBF7D0"}`, borderRadius: 14, padding: 24, marginBottom: 14, textAlign: "center" }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: symptomResult === "concern" ? "#3B6FE8" : "#059669", marginBottom: 10 }}>
                      {symptomResult === "concern" ? "Some signs to pay attention to" : "Looks relatively okay"}
                    </h3>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                      {symptomResult === "concern"
                        ? "Your responses suggest some possible signs of distress. This is not a diagnosis — speaking with a mental health professional is a positive step."
                        : "Your responses suggest mild stress. Good sleep, regular exercise, and social connection can help. Monitor how you feel."}
                    </p>
                  </div>
                  <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#92400E", marginBottom: 16, lineHeight: 1.5 }}>
                    ⚠️ This is not a clinical diagnosis. Please consult a qualified mental health professional.
                  </div>
                  <button
                    style={{ background: "#3B6FE8", color: "#fff", border: "none", borderRadius: 12, padding: "13px", width: "100%", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif" }}
                    onClick={() => { setSymptomStep(0); setSymptomAnswers({}); setSymptomResult(null); }}>
                    Start Again
                  </button>
                </>
              ) : (
                <>
                  <div style={{ height: 6, background: "#E8E8F0", borderRadius: 3, marginBottom: 24, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg,#3B6FE8,#7C3AED)", width: `${((symptomStep + 1) / QUESTIONS.length) * 100}%`, transition: "width 0.4s", borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>Question {symptomStep + 1} of {QUESTIONS.length}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 24, color: "#1A1A2E" }}>{QUESTIONS[symptomStep].q}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {QUESTIONS[symptomStep].opts.map(opt => (
                      <button key={opt} onClick={() => handleAnswer(opt)}
                        style={{ textAlign: "left", padding: "14px 18px", borderRadius: 11, border: "2px solid #E8E8F0", background: "#fff", fontSize: 14, cursor: "pointer", color: "#1A1A2E", fontFamily: "sans-serif", transition: "border-color 0.2s" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* MYTHS */}
        {!loading && tab === "myths" && (
          <>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Myths & Facts</h2>
            <p style={{ color: "#64748B", marginBottom: 28 }}>Breaking the stigma around mental health — one myth at a time.</p>
            {myths.map((m: any) => (
              <div key={m.id} style={{ background: "#fff", borderRadius: 16, padding: 26, marginBottom: 14, border: "1px solid #E8E8F0" }}>
                <span style={{ background: "#FEE2E2", color: "#DC2626", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Myth</span>
                <div style={{ fontSize: 17, fontWeight: 600, textDecoration: "line-through", color: "#94A3B8", margin: "10px 0 12px" }}>{m.myth_text}</div>
                <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1 }}>Fact ✓</span>
                <div style={{ fontSize: 14, color: "#1A1A2E", lineHeight: 1.6, marginTop: 10 }}>{m.fact_text}</div>
              </div>
            ))}
          </>
        )}

        {/* GLOSSARY */}
        {!loading && tab === "glossary" && (
          <>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Treatment Glossary</h2>
            <p style={{ color: "#64748B", marginBottom: 28 }}>Plain-language explanations of common mental health treatments.</p>
            {glossary.map((g: any) => (
              <div key={g.id} style={{ background: "#fff", borderRadius: 14, padding: 22, marginBottom: 10, border: "1px solid #E8E8F0" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#3B6FE8", marginBottom: 8 }}>{g.term}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{g.definition}</div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
