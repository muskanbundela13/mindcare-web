"use client";
import { useState, useEffect } from "react";

const API = "https://mindcare-app-nine.vercel.app";
const USER_ID = "user_demo_001";

export default function Crisis() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [tab, setTab] = useState("help");
  const [safetyPlan, setSafetyPlan] = useState({ warningSigns: [""], copingStrategies: [""], supportContacts: [{ name: "", phone: "" }] });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/crisis/contacts`).then(r => r.json()).then(d => setContacts(d.data || []));
    fetch(`${API}/api/crisis/safety-plan/${USER_ID}`).then(r => r.json()).then(d => {
      if (d.data) setSafetyPlan({ warningSigns: d.data.warning_signs || [""], copingStrategies: d.data.coping_strategies || [""], supportContacts: d.data.support_contacts || [{ name: "", phone: "" }] });
    });
  }, []);

  async function savePlan() {
    await fetch(`${API}/api/crisis/safety-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, warningSigns: safetyPlan.warningSigns.filter(Boolean), copingStrategies: safetyPlan.copingStrategies.filter(Boolean), supportContacts: safetyPlan.supportContacts })
    });
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  }

  const S: Record<string, any> = {
    page: { fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh" },
    tabs: { background: "#1A1A2E", display: "flex", gap: 4, padding: "0 40px" },
    tab: (a: boolean) => ({ padding: "13px 20px", background: "none", border: "none", borderBottom: a ? "3px solid #DC2626" : "3px solid transparent", color: a ? "#FCA5A5" : "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    content: { maxWidth: 900, margin: "0 auto", padding: "32px 40px" },
    card: { background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E8E8F0", marginBottom: 16 },
    btn: (c = "#DC2626") => ({ padding: "10px 22px", background: c, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    input: { padding: "10px 14px", border: "2px solid #E8E8F0", borderRadius: 8, fontSize: 13, outline: "none", width: "100%" },
  };

  return (
    <div style={S.page}>
      {/* EMERGENCY BANNER */}
      <div style={{ background: "#DC2626", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🆘 In immediate danger? Call emergency services</div>
        <a href="tel:112" style={{ background: "#fff", color: "#DC2626", padding: "8px 24px", borderRadius: 10, fontWeight: 800, fontSize: 16, textDecoration: "none" }}>Call 112</a>
      </div>

      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#2D0A0A)", padding: "32px 40px", color: "#fff" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>🆘 Crisis & Emergency Support</h1>
        <p style={{ color: "#94A3B8", fontSize: 15 }}>You are not alone. Help is available right now.</p>
      </div>

      <div style={S.tabs}>
        {[["help","📞 Get Help Now"],["plan","🛡️ Safety Plan"],["resources","💡 Resources"]].map(([key, label]) => (
          <button key={key} style={S.tab(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={S.content}>

        {/* HELPLINES */}
        {tab === "help" && (
          <>
            <div style={{ background: "#FEE2E2", border: "2px solid #DC2626", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#DC2626", marginBottom: 8 }}>You matter. Help is one call away.</div>
              <div style={{ color: "#7F1D1D", fontSize: 14, lineHeight: 1.6 }}>If you're in crisis, please reach out to one of these helplines. They are confidential, non-judgmental, and free.</div>
            </div>

            {contacts.map((c: any) => (
              <div key={c.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{c.description}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>🕐 {c.available_hours}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`tel:${c.phone}`} style={{ ...S.btn(), textDecoration: "none", display: "inline-block" }}>📞 {c.phone}</a>
                </div>
              </div>
            ))}

            {/* BREATHING EXERCISE */}
            <div style={{ ...S.card, background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)", border: "2px solid #BFDBFE" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>🌬️ Try a quick breathing exercise</h3>
              <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>Box breathing can help reduce anxiety in just 2 minutes.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[["Inhale","4 seconds","#3B6FE8"],["Hold","4 seconds","#7C3AED"],["Exhale","4 seconds","#059669"],["Hold","4 seconds","#D97706"]].map(([label, dur, color]) => (
                  <div key={label} style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: `2px solid ${color}20` }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{dur}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SAFETY PLAN */}
        {tab === "plan" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🛡️ My Safety Plan</h2>
              <p style={{ color: "#64748B", fontSize: 14 }}>A safety plan is a personalized plan that helps you stay safe during a crisis. Fill it in advance — it could save your life.</p>
            </div>

            {saved && <div style={{ background: "#DCFCE7", color: "#16A34A", padding: "12px 16px", borderRadius: 10, fontWeight: 700, marginBottom: 16 }}>✅ Safety plan saved!</div>}

            {/* WARNING SIGNS */}
            <div style={S.card}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#DC2626" }}>⚠️ My Warning Signs</h3>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>What thoughts, feelings, or behaviors signal a crisis is coming?</p>
              {safetyPlan.warningSigns.map((sign, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input style={S.input} placeholder={`Warning sign ${i + 1}`} value={sign}
                    onChange={e => { const arr = [...safetyPlan.warningSigns]; arr[i] = e.target.value; setSafetyPlan(p => ({ ...p, warningSigns: arr })); }} />
                </div>
              ))}
              <button style={{ ...S.btn("#64748B"), fontSize: 12 }} onClick={() => setSafetyPlan(p => ({ ...p, warningSigns: [...p.warningSigns, ""] }))}>+ Add</button>
            </div>

            {/* COPING STRATEGIES */}
            <div style={S.card}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#059669" }}>💪 My Coping Strategies</h3>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>What helps you feel better when you're struggling?</p>
              {safetyPlan.copingStrategies.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input style={S.input} placeholder={`Coping strategy ${i + 1}`} value={s}
                    onChange={e => { const arr = [...safetyPlan.copingStrategies]; arr[i] = e.target.value; setSafetyPlan(p => ({ ...p, copingStrategies: arr })); }} />
                </div>
              ))}
              <button style={{ ...S.btn("#64748B"), fontSize: 12 }} onClick={() => setSafetyPlan(p => ({ ...p, copingStrategies: [...p.copingStrategies, ""] }))}>+ Add</button>
            </div>

            {/* SUPPORT CONTACTS */}
            <div style={S.card}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#3B6FE8" }}>👥 People I Can Call</h3>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>Who can you reach out to when you need support?</p>
              {safetyPlan.supportContacts.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input style={{ ...S.input, flex: 1 }} placeholder="Name" value={c.name}
                    onChange={e => { const arr = [...safetyPlan.supportContacts]; arr[i] = { ...arr[i], name: e.target.value }; setSafetyPlan(p => ({ ...p, supportContacts: arr })); }} />
                  <input style={{ ...S.input, flex: 1 }} placeholder="Phone number" value={c.phone}
                    onChange={e => { const arr = [...safetyPlan.supportContacts]; arr[i] = { ...arr[i], phone: e.target.value }; setSafetyPlan(p => ({ ...p, supportContacts: arr })); }} />
                </div>
              ))}
              <button style={{ ...S.btn("#64748B"), fontSize: 12 }} onClick={() => setSafetyPlan(p => ({ ...p, supportContacts: [...p.supportContacts, { name: "", phone: "" }] }))}>+ Add</button>
            </div>

            <button style={{ ...S.btn(), width: "100%", padding: "14px", fontSize: 15 }} onClick={savePlan}>Save Safety Plan</button>
          </>
        )}

        {/* RESOURCES */}
        {tab === "resources" && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>💡 Self-Help Resources</h2>
            {[
              { title: "Grounding Technique (5-4-3-2-1)", desc: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This brings you back to the present moment.", icon: "🌱" },
              { title: "Progressive Muscle Relaxation", desc: "Tense and release each muscle group from toes to head. Takes 10 minutes and significantly reduces physical anxiety symptoms.", icon: "💆" },
              { title: "TIPP Skills (DBT)", desc: "Temperature (cold water on face), Intense exercise, Paced breathing, Progressive relaxation. Quickly reduces emotional distress.", icon: "🧊" },
              { title: "Opposite Action", desc: "When depression says stay in bed — get up. When anxiety says avoid — approach. Acting opposite to urges breaks the cycle.", icon: "🔄" },
              { title: "Reach Out to Someone", desc: "Isolation makes things worse. Text or call one person today — a friend, family member, or a helpline. Connection heals.", icon: "🤝" },
            ].map((r, i) => (
              <div key={i} style={S.card}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{r.title}</div>
                    <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{r.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
