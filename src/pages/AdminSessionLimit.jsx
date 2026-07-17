// Admin session limit resolution page for pending admin login.
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";
import { continueAdminLogin } from "../services/authService.js";

export default function AdminSessionLimit() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sessions = state?.sessions || [];
  const pendingToken = state?.pendingToken;

  const toggle = (sessionId) => setSelected((current) => current.includes(sessionId) ? current.filter((id) => id !== sessionId) : [...current, sessionId]);
  const continueLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await continueAdminLogin({ pendingToken, revokeSessionIds: selected });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Could not continue admin login.");
    } finally {
      setLoading(false);
    }
  };

  if (!pendingToken) {
    return <section className="grid min-h-[100dvh] place-items-center px-4"><Container className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-soft"><h1 className="font-serif text-4xl">Session request expired</h1><Button to="/login" className="mt-6">Return to Login</Button></Container></section>;
  }

  return <section className="relative min-h-[100dvh] px-4 py-10"><button type="button" onClick={() => navigate("/login")} className="absolute left-4 top-4 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink shadow-sm transition hover:bg-linen"><ChevronLeft size={17} /> Cancel</button><Container className="max-w-4xl"><div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Admin security</p><h1 className="mt-3 font-serif text-4xl font-semibold">Maximum Active Admin Sessions Reached</h1><p className="mt-4 text-ink/60">You are already signed in on 3 devices. Select one or more sessions to sign out before continuing.</p>{error && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-ink/65">{error}</p>}<div className="mt-6 grid gap-3">{sessions.map((session) => <label key={session.sessionId} className="flex cursor-pointer gap-4 rounded-2xl border border-ink/10 p-4 transition hover:border-leaf"><input type="checkbox" checked={selected.includes(session.sessionId)} onChange={() => toggle(session.sessionId)} /><span className="grid gap-1 text-sm"><strong>{session.deviceName}</strong><span className="text-ink/60">{session.browser} · {session.os} · {session.ip}</span><span className="text-ink/50">Login: {session.loginAt ? new Date(session.loginAt).toLocaleString() : "-"} · Last active: {session.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : "-"}</span></span></label>)}</div><div className="mt-7 flex flex-wrap gap-3"><Button type="button" onClick={continueLogin} loading={loading} disabled={!selected.length}>Continue Login</Button><Button type="button" variant="secondary" onClick={() => setSelected(sessions.map((session) => session.sessionId))}>Sign Out All Devices</Button><Button to="/login" variant="secondary">Cancel Login</Button></div></div></Container></section>;
}
