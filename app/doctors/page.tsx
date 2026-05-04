"use client";
import { useState, useEffect } from "react";

const API = "https://mindcare-app-nine.vercel.app";
const USER_ID = "user_demo_001";

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tab, setTab] = useState("find");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [booked, setBooked] = useState(false);
  const [filter, setFilter] = useState({ specialization: "", maxFee: "" });

  useEffect(() => { fetchDoctors(); fetchAppointments(); }, []);

  async function fetchDoctors() {
    try {
      const params = new URLSearchParams();
      if (filter.specialization) params.append("specialization", filter.specialization);
      if (filter.maxFee) params.append("maxFee", filter.maxFee);
      const res = await fetch(`${API}/api/doctors?${params}`);
      const data = await res.json();
      setDoctors(data.data || []);
    } catch {} finally { setLoading(false); }
  }

  async function fetchAppointments() {
    try {
      const res = await fetch(`${API}/api/appointments/${USER_ID}`);
      const data = await res.json();
      setAppointments(data.data || []);
    } catch {}
  }

  async function bookAppointment() {
    if (!selectedDoctor || !bookingDate) return;
    await fetch(`${API}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, doctorId: selectedDoctor.id, scheduledAt: bookingDate, notes: bookingNotes })
    });
    setBooked(true); fetchAppointments();
    setTimeout(() => { setBooked(false); setSelectedDoctor(null); setBookingDate(""); }, 3000);
  }

  const S: Record<string, any> = {
    page: { fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh" },
    hero: { background: "linear-gradient(135deg,#1A1A2E,#0F3460)", padding: "40px", color: "#fff" },
    tabs: { background: "#1A1A2E", display: "flex", gap: 4, padding: "0 40px" },
    tab: (a: boolean) => ({ padding: "13px 20px", background: "none", border: "none", borderBottom: a ? "3px solid #3B6FE8" : "3px solid transparent", color: a ? "#60A5FA" : "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    content: { maxWidth: 1000, margin: "0 auto", padding: "32px 40px" },
    card: { background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E8E8F0", marginBottom: 16 },
    btn: (color = "#3B6FE8") => ({ padding: "10px 22px", background: color, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    input: { padding: "10px 14px", border: "2px solid #E8E8F0", borderRadius: 8, fontSize: 13, outline: "none", width: "100%" },
  };

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8 }}>👨‍⚕️ Doctor & Specialist Connect</h1>
        <p style={{ color: "#94A3B8", fontSize: 15 }}>Find verified mental health professionals and book consultations</p>
      </div>

      <div style={S.tabs}>
        {[["find","🔍 Find Doctors"],["appointments","📅 My Appointments"]].map(([key, label]) => (
          <button key={key} style={S.tab(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={S.content}>
        {tab === "find" && (
          <>
            {/* FILTERS */}
            <div style={{ ...S.card, display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>SPECIALIZATION</label>
                <select style={S.input} value={filter.specialization} onChange={e => setFilter(f => ({ ...f, specialization: e.target.value }))}>
                  <option value="">All Specializations</option>
                  <option>Psychiatrist</option>
                  <option>Clinical Psychologist</option>
                  <option>Psychotherapist</option>
                  <option>Counselor</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>MAX FEE (₹)</label>
                <input style={S.input} type="number" placeholder="e.g. 1000" value={filter.maxFee} onChange={e => setFilter(f => ({ ...f, maxFee: e.target.value }))} />
              </div>
              <button style={S.btn()} onClick={fetchDoctors}>Search</button>
            </div>

            {loading && <p style={{ color: "#64748B" }}>Loading doctors...</p>}

            {doctors.map((doc: any) => (
              <div key={doc.id} style={S.card}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>👨‍⚕️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{doc.name}</div>
                        <div style={{ color: "#3B6FE8", fontWeight: 600, fontSize: 14 }}>{doc.specialization}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E" }}>₹{doc.consultation_fee}</div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>per session</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, margin: "10px 0", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, color: "#475569" }}>⭐ {doc.rating} ({doc.review_count} reviews)</span>
                      <span style={{ fontSize: 13, color: "#475569" }}>🎓 {doc.experience_years} years exp.</span>
                      {doc.is_verified && <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>✓ Verified</span>}
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, marginBottom: 14 }}>{doc.bio}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={S.btn()} onClick={() => setSelectedDoctor(doc)}>Book Consultation</button>
                      <button style={{ ...S.btn("#F1F5F9"), color: "#475569" }}>View Profile</button>
                    </div>
                  </div>
                </div>

                {/* BOOKING FORM */}
                {selectedDoctor?.id === doc.id && (
                  <div style={{ marginTop: 20, padding: 20, background: "#F8FAFF", borderRadius: 12, border: "1px solid #DBEAFE" }}>
                    {booked ? (
                      <div style={{ background: "#DCFCE7", color: "#16A34A", padding: "14px 20px", borderRadius: 10, fontWeight: 700, textAlign: "center" }}>
                        ✅ Appointment booked successfully! You'll receive a confirmation.
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>Book with {doc.name}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                          <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>DATE & TIME</label>
                            <input type="datetime-local" style={S.input} value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>NOTES (optional)</label>
                            <input style={S.input} placeholder="What would you like to discuss?" value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={S.btn()} onClick={bookAppointment}>Confirm Booking</button>
                          <button style={{ ...S.btn("#F1F5F9"), color: "#475569" }} onClick={() => setSelectedDoctor(null)}>Cancel</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "appointments" && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>My Appointments</h2>
            {appointments.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", color: "#94A3B8", padding: 40 }}>
                No appointments yet. <button style={{ color: "#3B6FE8", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab("find")}>Find a doctor →</button>
              </div>
            ) : appointments.map((apt: any) => (
              <div key={apt.id} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{apt.doctor_name}</div>
                    <div style={{ color: "#3B6FE8", fontSize: 14 }}>{apt.specialization}</div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 8 }}>📅 {new Date(apt.scheduled_at).toLocaleString()}</div>
                    {apt.notes && <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>📝 {apt.notes}</div>}
                  </div>
                  <span style={{ background: apt.status === "confirmed" ? "#DCFCE7" : "#FEF3C7", color: apt.status === "confirmed" ? "#16A34A" : "#D97706", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const }}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
