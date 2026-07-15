// Dedicated admin sign-in page.
import "../adminTheme.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthTokens } from "../../api/apiClient.js";
import { adminAuthApi } from "../services/adminApi.js";

function safeReturnPath(value) {
  return typeof value === "string" && value.startsWith("/admin") ? value : "/admin";
}

export default function AdminSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await adminAuthApi.login(form);
      setAuthTokens(data.token, data.refreshToken);
      navigate(safeReturnPath(location.state?.from), { replace: true });
    } catch {
      setError("Unable to sign in with those credentials.");
    } finally { setLoading(false); }
  };
  return <main className="grid min-h-screen place-items-center bg-[var(--admin-bg)] p-4 text-[var(--admin-text)]"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 shadow-sm"><p className="font-serif text-3xl font-semibold">Velora</p><h1 className="mt-2 text-xl font-bold">Administration</h1><p className="mt-2 text-sm text-[var(--admin-muted)]">Sign in with your admin account.</p>{error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<label className="mt-6 grid gap-1.5 text-sm font-semibold">Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-lg border border-[var(--admin-border)] px-3 outline-none focus:border-[var(--admin-primary)]" required /></label><label className="mt-4 grid gap-1.5 text-sm font-semibold">Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 rounded-lg border border-[var(--admin-border)] px-3 outline-none focus:border-[var(--admin-primary)]" required /></label><button disabled={loading} className="mt-6 h-11 w-full rounded-lg bg-[var(--admin-primary)] text-sm font-bold text-white transition hover:bg-[var(--admin-primary-hover)] disabled:opacity-60">{loading ? "Signing In..." : "Sign In"}</button></form></main>;
}
