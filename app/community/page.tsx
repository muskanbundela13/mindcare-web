"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:4000";
const USER_ID = "user_demo_001";
const USERNAME = "Muskan";

const CATEGORIES = ["All", "Depression", "Anxiety", "Relationships", "Work Stress", "Grief", "Recovery", "General"];

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [tab, setTab] = useState("feed");
  const [category, setCategory] = useState("All");
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "General", isAnonymous: false });
  const [loading, setLoading] = useState(true);
  const [posted, setPosted] = useState(false);

  useEffect(() => { fetchPosts(); }, [category]);

  async function fetchPosts() {
    try {
      setLoading(true);
      const params = category !== "All" ? `?category=${category}` : "";
      const res = await fetch(`${API}/api/posts${params}`);
      const data = await res.json();
      setPosts(data.data || []);
    } catch {} finally { setLoading(false); }
  }

  async function submitPost() {
    if (!newPost.content.trim()) return;
    await fetch(`${API}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, username: USERNAME, ...newPost })
    });
    setPosted(true); setNewPost({ title: "", content: "", category: "General", isAnonymous: false });
    fetchPosts(); setTimeout(() => { setPosted(false); setTab("feed"); }, 2000);
  }

  async function likePost(id: number) {
    await fetch(`${API}/api/posts/${id}/like`, { method: "POST" });
    fetchPosts();
  }

  const S: Record<string, any> = {
    page: { fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh" },
    tabs: { background: "#1A1A2E", display: "flex", gap: 4, padding: "0 40px" },
    tab: (a: boolean) => ({ padding: "13px 20px", background: "none", border: "none", borderBottom: a ? "3px solid #3B6FE8" : "3px solid transparent", color: a ? "#60A5FA" : "#64748B", fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    content: { maxWidth: 900, margin: "0 auto", padding: "32px 40px" },
    card: { background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E8E8F0", marginBottom: 14 },
    btn: (c = "#3B6FE8") => ({ padding: "10px 22px", background: c, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }),
    input: { padding: "12px 14px", border: "2px solid #E8E8F0", borderRadius: 8, fontSize: 14, outline: "none", width: "100%", fontFamily: "sans-serif" },
  };

  return (
    <div style={S.page}>
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#0F3460)", padding: "40px", color: "#fff" }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8 }}>💬 Community & Peer Support</h1>
        <p style={{ color: "#94A3B8" }}>A safe, moderated space to share, connect, and support each other</p>
      </div>

      {/* SAFETY NOTICE */}
      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", padding: "10px 40px", fontSize: 13, color: "#92400E" }}>
        🛡️ This is a moderated community. Content is reviewed for safety. No harassment or harmful content is tolerated.
        If you're in crisis, please use our <a href="/crisis" style={{ color: "#DC2626", fontWeight: 600 }}>Crisis Support</a> feature.
      </div>

      <div style={S.tabs}>
        {[["feed","🏠 Feed"],["post","✍️ Share"],["guidelines","📋 Guidelines"]].map(([key, label]) => (
          <button key={key} style={S.tab(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={S.content}>

        {tab === "feed" && (
          <>
            {/* CATEGORY FILTER */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ padding: "7px 16px", borderRadius: 20, border: "2px solid", borderColor: category === cat ? "#3B6FE8" : "#E8E8F0", background: category === cat ? "#3B6FE8" : "#fff", color: category === cat ? "#fff" : "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {cat}
                </button>
              ))}
            </div>

            {loading && <p style={{ color: "#64748B" }}>Loading posts...</p>}

            {!loading && posts.length === 0 && (
              <div style={{ ...S.card, textAlign: "center", color: "#94A3B8", padding: 40 }}>
                No posts yet in this category. <button style={{ color: "#3B6FE8", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab("post")}>Be the first to share →</button>
              </div>
            )}

            {posts.map((post: any) => (
              <div key={post.id} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#3B6FE8,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>
                      {post.username[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{post.username}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span style={{ background: "#EFF6FF", color: "#3B6FE8", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{post.category}</span>
                </div>
                {post.title && <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{post.title}</div>}
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>{post.content}</div>
                <div style={{ display: "flex", gap: 12, borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                  <button onClick={() => likePost(post.id)}
                    style={{ background: "none", border: "none", fontSize: 13, color: "#64748B", cursor: "pointer", fontWeight: 600 }}>
                    ❤️ {post.likes} Hugs
                  </button>
                  <button style={{ background: "none", border: "none", fontSize: 13, color: "#64748B", cursor: "pointer", fontWeight: 600 }}>
                    💬 Reply
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "post" && (
          <div style={S.card}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>✍️ Share with the Community</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>Your story might help someone else feel less alone.</p>

            {posted && <div style={{ background: "#DCFCE7", color: "#16A34A", padding: "12px 16px", borderRadius: 10, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>✅ Post shared! Redirecting...</div>}

            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>CATEGORY</label>
            <select style={{ ...S.input, marginBottom: 14 }} value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>TITLE (optional)</label>
            <input style={{ ...S.input, marginBottom: 14 }} placeholder="Give your post a title..." value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />

            <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6, display: "block" }}>YOUR MESSAGE</label>
            <textarea style={{ ...S.input, minHeight: 160, resize: "vertical" as const, marginBottom: 14 }}
              placeholder="Share your experience, ask for support, or offer encouragement..." value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} />

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#475569", marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" checked={newPost.isAnonymous} onChange={e => setNewPost(p => ({ ...p, isAnonymous: e.target.checked }))} />
              Post anonymously (your name won't be shown)
            </label>

            <button style={{ ...S.btn(), width: "100%", padding: "14px", fontSize: 15 }} onClick={submitPost}>Share Post</button>
          </div>
        )}

        {tab === "guidelines" && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📋 Community Guidelines</h2>
            {[
              { icon: "💚", rule: "Be kind and compassionate", desc: "Treat everyone with empathy. We are all going through something difficult." },
              { icon: "🔒", rule: "Respect privacy", desc: "Don't share anyone's personal information. What's shared here stays here." },
              { icon: "🚫", rule: "No harmful content", desc: "Don't share methods of self-harm, suicide, or content that could trigger others." },
              { icon: "👂", rule: "Listen more than you advise", desc: "Sometimes people just need to be heard. Ask before giving advice." },
              { icon: "🌟", rule: "Encourage professional help", desc: "Support is great, but always encourage seeking professional help for serious issues." },
            ].map((g, i) => (
              <div key={i} style={S.card}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 28 }}>{g.icon}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{g.rule}</div>
                    <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{g.desc}</div>
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
