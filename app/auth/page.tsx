"use client";
import { supabase } from "../../lib/supabase";

export default function Login() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://mindcare-app-nine.vercel.app"
      }
    });
  }

  return (
    <div style={{ fontFamily: "sans-serif", background: "#F7F5F0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 48, maxWidth: 400, width: "100%", border: "1px solid #E8E8F0", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: "#1A1A2E" }}>Welcome to MindCare</h1>
        <p style={{ color: "#64748B", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Your mental health companion. Sign in to track your mood, access resources, and connect with professionals.
        </p>
        <button onClick={signInWithGoogle}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "2px solid #E8E8F0", background: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <p style={{ marginTop: 24, fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
          By signing in you agree to our terms. Your mental health data is private and encrypted.
        </p>
      </div>
    </div>
  );
}