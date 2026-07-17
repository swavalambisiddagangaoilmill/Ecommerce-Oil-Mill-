// Admin settings panels for notification preferences and active sessions.
import { useEffect, useState } from "react";
import { AdminButton, AdminCard } from "../components/AdminUi.jsx";
import { adminApi } from "../services/adminApi.js";

const labels = {
  new_order: "New Order", order_cancelled: "Order Cancelled", order_returned: "Order Returned", refund_requested: "Refund Requested", order_delivered: "Order Delivered",
  payment_successful: "Payment Successful", payment_failed: "Payment Failed", payment_refunded: "Payment Refunded",
  low_stock: "Low Stock", out_of_stock: "Out Of Stock", back_in_stock: "Product Back In Stock",
  new_user_registration: "New User Registration", contact_form_submission: "Contact Form Submission", newsletter_subscription: "Newsletter Subscription",
  failed_admin_login: "Failed Admin Login", multiple_failed_login_attempts: "Multiple Failed Login Attempts", password_changed: "Password Changed", suspicious_activity: "Suspicious Activity", admin_login: "Admin Login", admin_logout: "Admin Logout", admin_session_revoked: "Admin Session Revoked",
  email_delivery_failed: "Email Delivery Failed", shipping_api_error: "Shipping API Error", backup_failed: "Backup Failed", critical_server_error: "Critical Server Error",
};

function title(value) { return String(value).replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()); }

export default function AdminSettingsExtras() {
  const [prefs, setPrefs] = useState([]);
  const [sessions, setSessions] = useState(null);
  const [enabled, setEnabled] = useState({});
  const load = async () => {
    const [prefData, sessionData] = await Promise.all([adminApi.notificationPreferences(), adminApi.sessions()]);
    setPrefs(prefData.types || []);
    setEnabled(Object.fromEntries((prefData.types || []).map((item) => [item.type, item.enabled])));
    setSessions(sessionData);
  };
  useEffect(() => { load(); }, []);
  const savePrefs = async () => { await adminApi.saveNotificationPreferences(enabled); load(); };
  const revoke = async (ids) => { await adminApi.revokeSessions(ids); load(); };
  const grouped = prefs.reduce((acc, item) => ({ ...acc, [item.category]: [...(acc[item.category] || []), item] }), {});

  return <><section className="grid gap-4 rounded-xl border border-[var(--admin-border)] bg-white p-5 shadow-sm xl:col-span-2"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Notification Settings</h2><AdminButton type="button" onClick={savePrefs}>Save Notifications</AdminButton></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Object.entries(grouped).map(([category, items]) => <div key={category} className="rounded-xl bg-linen/60 p-4"><p className="mb-3 text-sm font-bold">{title(category)}</p><div className="grid gap-2">{items.map((item) => <label key={item.type} className="flex items-center gap-2 text-sm font-semibold text-ink/70"><input type="checkbox" checked={enabled[item.type] !== false} onChange={(event) => setEnabled((current) => ({ ...current, [item.type]: event.target.checked }))} />{labels[item.type] || title(item.type)}</label>)}</div></div>)}</div></section><section className="grid gap-4 rounded-xl border border-[var(--admin-border)] bg-white p-5 shadow-sm xl:col-span-2"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Admin Sessions</h2><span className="text-sm font-semibold text-ink/50">{sessions?.active?.length || 0}/{sessions?.max || 3} active devices</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{sessions?.active?.map((session) => <AdminCard key={session.sessionId} title={session.current ? "Current Device" : session.deviceName} value={session.browser} note={`${session.os} · ${session.ip}`}><p className="mt-3 text-xs text-ink/50">Last active: {new Date(session.lastActiveAt).toLocaleString("en-IN")}</p>{!session.current && <AdminButton type="button" variant="secondary" className="mt-3" onClick={() => revoke([session.sessionId])}>Sign Out Device</AdminButton>}</AdminCard>)}</div>{sessions?.active?.some((session) => !session.current) && <AdminButton type="button" variant="secondary" onClick={() => revoke(sessions.active.filter((session) => !session.current).map((session) => session.sessionId))}>Sign Out All Other Devices</AdminButton>}</section></>;
}
