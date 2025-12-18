"use client";

import { useState } from "react";

export default function AuthForm({ initialMode = "login" }: { initialMode?: "login" | "signup" }) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  async function signup() {
    if (password !== confirm) return setMessage("Passwords do not match");
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        setMessage(`Server responded ${res.status}: ${text || "no content"}`);
        return;
      }
      if (!res.ok) setMessage(data.error || "Signup failed");
      else setMessage(data.message || "Signup successful. Check your email to verify your account.");
    } catch (err: any) {
      setMessage("Signup failed: " + (err && err.message));
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        setMessage(`Server responded ${res.status}: ${text || "no content"}`);
        return;
      }
      if (!res.ok) setMessage(data.error || "Login failed");
      else setMessage(data.message || "Login successful");
    } catch (err: any) {
      setMessage("Login failed: " + (err && err.message));
    } finally {
      setLoading(false);
    }
  }

  async function sendForgot() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) setMessage(data.error || "Failed to send reset email");
      else setMessage(data.message || "Reset email sent");
    } catch (err: any) {
      setMessage("Request failed: " + (err && err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-center">
        <div className="text-2xl font-bold text-slate-800">TaskManager</div>
      </div>

      <div className="mt-4">
        <div className="flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full ${mode === "login" ? "bg-white shadow" : ""}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-full ${mode === "signup" ? "bg-white shadow" : ""}`}
          >
            Signup
          </button>
        </div>

        <div className="mt-6">
          {mode === "signup" ? (
            <div>
              <input className="w-full p-3 border rounded mb-3" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="w-full p-3 border rounded mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className="w-full p-3 border rounded mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="password" className="w-full p-3 border rounded mb-3" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <button className="w-full bg-indigo-600 text-white py-3 rounded" onClick={signup} disabled={loading}>
                {loading ? "Working..." : "Signup"}
              </button>
            </div>
          ) : (
            <div>
              <input className="w-full p-3 border rounded mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className="w-full p-3 border rounded mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <div className="flex justify-between items-center mb-3">
                <button className="text-sm text-sky-600" onClick={() => setShowForgot(!showForgot)}>Forgot password?</button>
                <button className="text-sm text-gray-500">Not a member? <span className="text-sky-600 cursor-pointer" onClick={() => setMode("signup")}>Signup</span></button>
              </div>

              {showForgot && (
                <div className="mb-3">
                  <input className="w-full p-3 border rounded mb-2" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                  <button className="w-full bg-amber-500 text-white py-2 rounded" onClick={sendForgot} disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
                </div>
              )}

              <button className="w-full bg-emerald-600 text-white py-3 rounded" onClick={login} disabled={loading}>
                {loading ? "Working..." : "Login"}
              </button>
            </div>
          )}

          {message && <div className="mt-4 p-3 bg-gray-100 rounded">{message}</div>}
        </div>
      </div>
    </div>
  );
}