'use client';

import { useState, useRef, useEffect } from 'react';

const FEATURES = [
  {
    icon: '💬',
    title: 'Guided Sessions',
    description:
      'Structured CBT, DBT & mindfulness exercises personalised to your mood history and goals.',
  },
  {
    icon: '📈',
    title: 'Progress Insights',
    description:
      'Weekly reports, streak tracking & milestone badges to keep you motivated and accountable.',
  },
  {
    icon: '🔔',
    title: 'Session Reminders',
    description:
      'Smart nudges based on your schedule and emotional patterns so you never miss a check-in.',
  },
];

const PROGRAMMES = [
  { id: 'anxiety', label: 'Anxiety & Stress', weeks: 8, color: '#7c3aed' },
  { id: 'sleep', label: 'Better Sleep', weeks: 4, color: '#0891b2' },
  { id: 'mood', label: 'Mood Regulation', weeks: 6, color: '#059669' },
  { id: 'confidence', label: 'Self-Confidence', weeks: 6, color: '#d97706' },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'buddy',
    text: "Hey! How are you feeling since our last check-in? I noticed your mood dipped midweek — want to explore what was happening?",
  },
];

const MOOD_DATA = [
  { day: 'Mon', value: 60 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 55 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 80 },
  { day: 'Sun', value: 65 },
];

const MILESTONES = [
  { icon: '🌱', label: 'First session completed', done: true },
  { icon: '🔥', label: '7-day streak', done: true },
  { icon: '💬', label: '10 sessions done', done: false },
  { icon: '🏆', label: 'Programme complete', done: false },
];

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={styles.featureCard}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <p style={styles.featureTitle}>{title}</p>
        <p style={styles.featureDesc}>{description}</p>
      </div>
    </div>
  );
}

function ProgrammeCard({ programme, selected, onSelect }: { programme: any; selected: string; onSelect: (id: string) => void }) {
  const isSelected = selected === programme.id;
  return (
    <button
      onClick={() => onSelect(programme.id)}
      style={{
        ...styles.progCard,
        borderColor: isSelected ? programme.color : '#e5e7eb',
        backgroundColor: isSelected ? programme.color + '10' : '#fff',
      }}
    >
      <div style={{ ...styles.progDot, backgroundColor: programme.color }} />
      <div style={{ textAlign: 'left' }}>
        <p style={{ ...styles.progLabel, color: isSelected ? programme.color : '#111827' }}>
          {programme.label}
        </p>
        <p style={styles.progWeeks}>{programme.weeks}-week programme</p>
      </div>
      {isSelected && (
        <span style={{ ...styles.progCheck, color: programme.color }}>✓</span>
      )}
    </button>
  );
}

function ChatBubble({ message }: { message: any }) {
  const isBuddy = message.sender === 'buddy';
  return (
    <div style={{ display: 'flex', justifyContent: isBuddy ? 'flex-start' : 'flex-end', marginBottom: 12 }}>
      {isBuddy && <div style={styles.buddyAvatar}>🧠</div>}
      <div style={{
        maxWidth: '72%',
        padding: '10px 14px',
        borderRadius: isBuddy ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        backgroundColor: isBuddy ? '#f3f4f6' : '#7c3aed',
        color: isBuddy ? '#111827' : '#fff',
        fontSize: 14,
        lineHeight: 1.5,
      }}>
        {message.text}
      </div>
    </div>
  );
}

function SessionProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={styles.progressWrap}>
      <div style={styles.progressHeader}>
        <span style={styles.progressLabel}>Session {current} of {total}</span>
        <span style={styles.progressPct}>{pct}% complete</span>
      </div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function TherapyBuddy() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProgramme, setSelectedProgramme] = useState('anxiety');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const programme = PROGRAMMES.find((p) => p.id === selectedProgramme);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const replies = [
        "That makes a lot of sense. Let's try a quick thought-record exercise — what was the situation, and what thoughts came up for you?",
        "I hear you. Recognising that feeling is already a big step. Would you like to try a grounding exercise together?",
        "Thank you for sharing that. What would it feel like to approach this situation with a little more self-compassion?",
        "It sounds like that was really tough. Let's slow down and notice what's happening in your body right now — any tension anywhere?",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'buddy', text: reply }]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const TABS = [
    { id: 'overview', label: '🏠 Overview' },
    { id: 'session', label: '💬 Session' },
    { id: 'progress', label: '📈 Progress' },
  ];

  const maxMood = Math.max(...MOOD_DATA.map((d) => d.value));

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIconWrap}>🧠</div>
            <div>
              <div style={styles.headerTop}>
                <h1 style={styles.headerTitle}>Therapy Buddy</h1>
                <span style={styles.premiumBadge}>✦ Premium</span>
              </div>
              <p style={styles.headerSub}>
                Your personalised AI companion for structured therapy sessions & progress tracking
              </p>
            </div>
          </div>
          <div style={styles.sessionInfo}>
            <div style={styles.sessionDot} />
            <div>
              <p style={styles.sessionNext}>Next session</p>
              <p style={styles.sessionTime}>Tomorrow, 9:00 AM</p>
            </div>
          </div>
        </div>
        <div style={styles.tabBar}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : {}) }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={styles.section}>
            <div style={styles.onTrackBanner}>
              <div style={styles.onTrackLeft}>
                <span style={{ fontSize: 20 }}>🎯</span>
                <div>
                  <p style={styles.onTrackTitle}>Week 2 · Anxiety & Stress Programme</p>
                  <p style={styles.onTrackSub}>You're on track — 4 sessions completed this month</p>
                </div>
              </div>
              <span style={styles.onTrackBadge}>On track ✓</span>
            </div>
            <SessionProgress current={4} total={8} />
            <h2 style={styles.sectionHeading}>What's included</h2>
            <div style={styles.featuresGrid}>
              {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
            </div>
            <h2 style={styles.sectionHeading}>Choose your programme</h2>
            <div style={styles.progGrid}>
              {PROGRAMMES.map((p) => (
                <ProgrammeCard key={p.id} programme={p} selected={selectedProgramme} onSelect={setSelectedProgramme} />
              ))}
            </div>
            <button onClick={() => setActiveTab('session')} style={styles.ctaButton}>
              Start today's session →
            </button>
          </div>
        )}

        {/* SESSION */}
        {activeTab === 'session' && (
          <div style={styles.section}>
            <div style={styles.chatWrap}>
              <div style={styles.chatHeader}>
                <span style={styles.chatHeaderTitle}>Session 5 · {programme?.label}</span>
                <SessionProgress current={5} total={programme?.weeks ?? 8} />
              </div>
              <div style={styles.chatMessages}>
                {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={styles.buddyAvatar}>🧠</div>
                    <div style={styles.typingDots}>
                      <span style={styles.dot} />
                      <span style={styles.dot} />
                      <span style={styles.dot} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={styles.chatInput}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share how you're feeling..."
                  rows={2}
                  style={styles.textarea}
                />
                <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
              </div>
            </div>
            <p style={styles.disclaimer}>
              Therapy Buddy supports your mental wellness journey but is not a substitute for professional care.
              In a crisis? Call iCall: 9152987821
            </p>
          </div>
        )}

        {/* PROGRESS */}
        {activeTab === 'progress' && (
          <div style={styles.section}>
            <div style={styles.statsGrid}>
              {[
                { label: 'Sessions Done', value: '12', sub: '4 this week' },
                { label: 'Current Streak', value: '7', sub: 'days in a row 🔥' },
                { label: 'Mood Average', value: '72%', sub: 'up 8% this week' },
                { label: 'Programme', value: '50%', sub: 'Week 4 of 8' },
              ].map((s) => (
                <div key={s.label} style={styles.statCard}>
                  <p style={styles.statLabel}>{s.label}</p>
                  <p style={styles.statValue}>{s.value}</p>
                  <p style={styles.statSub}>{s.sub}</p>
                </div>
              ))}
            </div>
            <h2 style={styles.sectionHeading}>Mood this week</h2>
            <div style={styles.moodChart}>
              {MOOD_DATA.map((d) => (
                <div key={d.day} style={styles.moodBarWrap}>
                  <div style={{ ...styles.moodBar, height: `${(d.value / maxMood) * 100}%` }} />
                  <p style={styles.moodDay}>{d.day}</p>
                </div>
              ))}
            </div>
            <h2 style={styles.sectionHeading}>Milestones</h2>
            <div style={styles.milestones}>
              {MILESTONES.map((m) => (
                <div key={m.label} style={{ ...styles.milestone, opacity: m.done ? 1 : 0.45 }}>
                  {m.done && <span style={styles.milestoneDone}>✓</span>}
                  <span style={{ fontSize: 28 }}>{m.icon}</span>
                  <p style={styles.milestoneLabel}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' },
  header: { backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '20px 24px 0' },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  headerIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
  headerTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 },
  premiumBadge: { fontSize: 11, fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '3px 8px' },
  headerSub: { fontSize: 13, color: '#6b7280', margin: 0 },
  sessionInfo: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px' },
  sessionDot: { width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 },
  sessionNext: { fontSize: 11, color: '#9ca3af', margin: 0 },
  sessionTime: { fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 },
  tabBar: { display: 'flex', gap: 4 },
  tab: { padding: '10px 18px', fontSize: 14, fontWeight: 500, color: '#6b7280', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer' },
  tabActive: { color: '#7c3aed', borderBottomColor: '#7c3aed', fontWeight: 600 },
  body: { maxWidth: 780, margin: '0 auto', padding: '1.5rem' },
  section: { display: 'flex', flexDirection: 'column', gap: 16 },
  onTrackBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderLeft: '4px solid #7c3aed', borderRadius: 12, padding: '14px 16px', flexWrap: 'wrap', gap: 10 },
  onTrackLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  onTrackTitle: { fontWeight: 600, fontSize: 14, margin: 0, color: '#111827' },
  onTrackSub: { fontSize: 13, color: '#6b7280', margin: 0 },
  onTrackBadge: { fontSize: 12, fontWeight: 600, backgroundColor: '#dcfce7', color: '#15803d', borderRadius: 6, padding: '4px 10px' },
  progressWrap: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, color: '#6b7280' },
  progressPct: { fontSize: 13, fontWeight: 600, color: '#7c3aed' },
  progressTrack: { height: 8, backgroundColor: '#ede9fe', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7c3aed', borderRadius: 99, transition: 'width 0.5s ease' },
  sectionHeading: { fontSize: 16, fontWeight: 600, color: '#111827', margin: '4px 0 -4px' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  featureCard: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' },
  featureTitle: { fontWeight: 600, fontSize: 14, margin: '0 0 4px', color: '#111827' },
  featureDesc: { fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 },
  progGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 },
  progCard: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#fff', border: '2px solid', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', transition: 'border-color 0.15s, background-color 0.15s', textAlign: 'left' },
  progDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  progLabel: { fontSize: 14, fontWeight: 600, margin: 0 },
  progWeeks: { fontSize: 12, color: '#9ca3af', margin: 0 },
  progCheck: { marginLeft: 'auto', fontWeight: 700, fontSize: 16 },
  ctaButton: { backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' },
  chatWrap: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  chatHeader: { padding: '14px 16px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#faf9ff' },
  chatHeaderTitle: { fontSize: 14, fontWeight: 600, color: '#7c3aed', display: 'block', marginBottom: 10 },
  chatMessages: { padding: '16px', minHeight: 300, maxHeight: 420, overflowY: 'auto' },
  buddyAvatar: { width: 32, height: 32, borderRadius: '50%', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginRight: 8 },
  typingDots: { display: 'flex', gap: 4, alignItems: 'center', backgroundColor: '#f3f4f6', padding: '10px 14px', borderRadius: '4px 16px 16px 16px' },
  dot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', backgroundColor: '#9ca3af' },
  chatInput: { display: 'flex', gap: 10, padding: '12px 16px', borderTop: '1px solid #f3f4f6', alignItems: 'flex-end' },
  textarea: { flex: 1, border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', fontSize: 14, resize: 'none', fontFamily: 'inherit', color: '#111827', backgroundColor: '#fff', outline: 'none' },
  sendBtn: { backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0 },
  disclaimer: { fontSize: 12, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 },
  statCard: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px' },
  statLabel: { fontSize: 12, color: '#9ca3af', margin: '0 0 6px', fontWeight: 500 },
  statValue: { fontSize: 26, fontWeight: 700, color: '#7c3aed', margin: '0 0 2px' },
  statSub: { fontSize: 12, color: '#6b7280', margin: 0 },
  moodChart: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 },
  moodBarWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' },
  moodBar: { width: '100%', backgroundColor: '#c4b5fd', borderRadius: '6px 6px 0 0', minHeight: 4, transition: 'height 0.4s ease' },
  moodDay: { fontSize: 11, color: '#9ca3af', margin: 0 },
  milestones: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 },
  milestone: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', position: 'relative' },
  milestoneLabel: { fontSize: 13, color: '#374151', margin: 0, fontWeight: 500, lineHeight: 1.3 },
  milestoneDone: { position: 'absolute', top: 8, right: 10, color: '#22c55e', fontSize: 13, fontWeight: 700 },
};