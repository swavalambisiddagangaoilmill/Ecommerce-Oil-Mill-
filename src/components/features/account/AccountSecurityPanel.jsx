// Displays authenticated account security, sessions, devices, and login history.
import { Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";
import { changeAccountPassword, fetchSecurityDetails, requestSecurityOtp, resendVerificationEmail, revokeAccountSession, revokeAllAccountSessions } from "../../../services/accountService.js";

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not available";
}

export default function AccountSecurityPanel({ onLogout }) {
  const [security, setSecurity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSecurity = async () => {
    try {
      const data = await fetchSecurityDetails();
      setSecurity(data.security);
    } catch (err) {
      setError(err.message || "Unable to load security details.");
    }
  };

  useEffect(() => { loadSecurity(); }, []);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2800);
  };

  const sendOtp = async () => {
    setSaving(true);
    setError("");
    try {
      await requestSecurityOtp("change_password");
      showMessage("Security code sent to your email.");
    } catch (err) {
      setError(err.message || "Unable to send security code.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    if (password !== form.get("confirmPassword")) {
      setError("New password and confirm password must match.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await changeAccountPassword({ currentPassword: form.get("currentPassword"), password, otpCode: form.get("otpCode") });
      await onLogout?.();
    } catch (err) {
      setError(err.message || "Unable to change password.");
    } finally {
      setSaving(false);
    }
  };

  const resendVerification = async () => {
    setSaving(true);
    setError("");
    try {
      await resendVerificationEmail();
      showMessage("Verification email sent.");
    } catch (err) {
      setError(err.message || "Unable to resend verification email.");
    } finally {
      setSaving(false);
    }
  };

  const revokeSession = async (id) => {
    setSaving(true);
    setError("");
    try {
      const data = await revokeAccountSession(id);
      setSecurity(data.security);
      showMessage("Session revoked.");
    } catch (err) {
      setError(err.message || "Unable to revoke session.");
    } finally {
      setSaving(false);
    }
  };

  const logoutAll = async () => {
    setSaving(true);
    setError("");
    try {
      await revokeAllAccountSessions();
      await onLogout?.();
    } catch (err) {
      setError(err.message || "Unable to logout all devices.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="font-serif text-3xl font-semibold">Account & Security</h2>
      {message && <p className="mt-5 rounded-2xl bg-leaf/10 p-4 text-sm font-semibold text-leaf">{message}</p>}
      {error && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-danger">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-cream p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">Email</p><p className="mt-2 font-bold">{security?.emailVerified ? "Verified" : "Not verified"}</p>{!security?.emailVerified && <button type="button" onClick={resendVerification} className="mt-3 text-sm font-bold text-leaf">Resend email</button>}</div>
        <div className="rounded-2xl bg-cream p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">Google</p><p className="mt-2 font-bold">{security?.googleLinked ? "Connected" : "Not connected"}</p></div>
        <div className="rounded-2xl bg-cream p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">Sessions</p><p className="mt-2 font-bold">{security?.sessions?.length ?? 0}</p></div>
        <div className="rounded-2xl bg-cream p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">Password changed</p><p className="mt-2 font-bold">{formatDate(security?.passwordChangedAt)}</p></div>
      </div>

      <form onSubmit={handlePasswordChange} className="mt-6 max-w-xl rounded-2xl bg-cream p-5">
        <div className="mb-5 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-white text-leaf"><Lock size={18} /></span><div><p className="font-semibold">Change Password</p><p className="text-sm text-ink/50">Send a code first, then update your password.</p></div></div>
        <div className="grid gap-4"><Input label="Current password" name="currentPassword" type="password" required /><Input label="New password" name="password" type="password" required /><Input label="Confirm new password" name="confirmPassword" type="password" required /><Input label="Email security code" name="otpCode" inputMode="numeric" maxLength={6} required /></div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button type="button" variant="secondary" loading={saving} onClick={sendOtp}>Send Code</Button><Button type="submit" loading={saving}>Update Password</Button></div>
      </form>

      <div className="mt-6 rounded-2xl border border-ink/10 p-5">
        <div className="flex items-center gap-3"><ShieldCheck size={20} className="text-leaf" /><p className="font-semibold">Active Sessions</p></div>
        <div className="mt-4 grid gap-3">
          {(security?.sessions || []).length === 0 && <p className="text-sm text-ink/60">No active sessions found.</p>}
          {(security?.sessions || []).map((session) => <div key={session.sessionId} className="rounded-2xl bg-cream p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{session.device || "Device"} - {session.browser || "Browser"}</p><p className="mt-1 text-sm text-ink/55">{session.os || "OS"} • Last active {formatDate(session.lastActive)}</p></div><button type="button" onClick={() => revokeSession(session.sessionId)} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-danger">Logout Device</button></div></div>)}
        </div>
        <Button type="button" variant="secondary" className="mt-5" loading={saving} onClick={logoutAll}>Logout All Devices</Button>
      </div>

      <div className="mt-6 rounded-2xl border border-ink/10 p-5">
        <p className="font-semibold">Recent Login History</p>
        <div className="mt-4 grid gap-2">
          {(security?.loginHistory || []).slice(0, 8).map((item) => <div key={item._id || `${item.type}-${item.createdAt}`} className="rounded-xl bg-cream p-3 text-sm"><span className="font-bold">{item.type}</span><span className="text-ink/50"> • {item.browser || "Browser"} • {formatDate(item.createdAt)}</span></div>)}
        </div>
      </div>
    </section>
  );
}
