"use client";
import Link from "next/link";

const MODULES = [
  { href: "/education", icon: "📚", title: "Education Hub", desc: "Learn about conditions, symptoms & treatments", color: "#3B6FE8", bg: "#EFF6FF" },
  { href: "/assessment", icon: "📊", title: "Mood & Assessment", desc: "Track mood, journal, and take PHQ-9 screening", color: "#7C3AED", bg: "#F5F3FF" },
  { href: "/chatbot", icon: "🤖", title: "AI Support Chat", desc: "24/7 empathetic support chatbot", color: "#0891B2", bg: "#ECFEFF" },
  { href: "/doctors", icon: "👨‍⚕️", title: "Find a Doctor", desc: "Book consultations with verified specialists", color: "#059669", bg: "#F0FDF4" },
  { href: "/crisis", icon: "🆘", title: "Crisis Support", desc: "Emergency helplines and safety planning", color: "#DC2626", bg: "#FEF2F2" },
  { href: "/wellness", icon: "🌱", title: "Wellness Tools", desc: "Meditation, breathing, sleep & gratitude", color: "#D97706", bg: "#FFFBEB" },
  { href: "/community", icon: "💬", title: "Community", desc: "Peer support forums and shared experiences", color: "#7C3AED", bg: "#F5F3FF" },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)", padding: "60px 40px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,111,232,0.3),transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🧠</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>MindCare</div>
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
            Your Mental Health<br /><span style={{ color: "#60A5FA" }}>Companion</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 17, maxWidth: 520, lineHeight: 1.6 }}>
            Information, support, therapy tools, and professional care — all in one place. You are not alone.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/chatbot" style={{ padding: "14px 28px", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", color: "#fff", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
              💬 Talk to AI Support
            </Link>
            <Link href="/crisis" style={{ padding: "14px 28px", background: "#DC2626", color: "#fff", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
              🆘 Get Crisis Help
            </Link>
          </div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", padding: "12px 40px", fontSize: 13, color: "#92400E" }}>
        ⚠️ MindCare provides information and support tools only. It is not a substitute for professional medical or psychiatric care. If you are in crisis, please call 112 or iCall at 9152987821.
      </div>

      {/* MODULES GRID */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>What do you need today?</h2>
        <p style={{ color: "#64748B", fontSize: 15, marginBottom: 36 }}>Choose a module to get started</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #E8E8F0", cursor: "pointer", transition: "all 0.3s", borderLeft: `4px solid ${m.color}` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16 }}>{m.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#1A1A2E" }}>{m.title}</div>
                <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>{m.desc}</div>
                <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: m.color }}>Open →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#1A1A2E", padding: "32px 40px", color: "#64748B", textAlign: "center" }}>
        <div style={{ fontSize: 14, marginBottom: 8 }}>🧠 MindCare — Mental Health Support Platform</div>
        <div style={{ fontSize: 12 }}>For emergencies: Call 112 | iCall: 9152987821 | Vandrevala: 1860-2662-345</div>
      </div>
    </div>
  );
}
