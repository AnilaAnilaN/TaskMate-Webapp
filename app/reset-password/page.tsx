"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params?.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (password !== confirm) return setMessage("Passwords do not match");
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) setMessage(data.error || "Reset failed");
      else setMessage(data.message || "Password reset successful");
    } catch (err: any) {
      setMessage("Reset failed: " + (err && err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-r from-sky-700 to-indigo-700 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <input className="w-full p-3 border rounded mb-3" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="w-full p-3 border rounded mb-3" type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button className="w-full bg-emerald-600 text-white py-3 rounded" onClick={submit} disabled={loading}>{loading ? "Working..." : "Set new password"}</button>
        {message && <div className="mt-4 p-3 bg-gray-100 rounded">{message}</div>}
      </div>
    </div>
  );
}
