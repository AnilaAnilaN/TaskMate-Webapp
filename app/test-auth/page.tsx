"use client";

import { useState } from "react";

export default function TestAuthPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signup() {
    try {
      setLoading(true);
      setMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text();
        setMessage(`Server responded ${res.status}: ${text || "no content"}`);
        return;
      }

      if (!res.ok) {
        setMessage(data.error || `Signup failed: ${res.status}`);
      } else {
        setMessage(data.message || "Signup successful. Check your email to verify your account.");
      }
    } catch (err) {
      setMessage("Signup failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    try {
      setLoading(true);
      setMessage(null);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        const text = await res.text();
        setMessage(`Server responded ${res.status}: ${text || "no content"}`);
        return;
      }

      if (!res.ok) {
        setMessage(data.error || `Login failed: ${res.status}`);
      } else {
        setMessage(data.message || "Login successful");
      }
    } catch (err) {
      setMessage("Login failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">Auth Test Page</h1>

      <input
        className="border p-2 w-full"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={signup}
          className="bg-blue-600 text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? "Working..." : "Sign Up"}
        </button>

        <button
          onClick={login}
          className="bg-green-600 text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? "Working..." : "Login"}
        </button>
      </div>

      {message && <div className="mt-4 p-3 bg-gray-100">{message}</div>}
    </div>
  );
}
