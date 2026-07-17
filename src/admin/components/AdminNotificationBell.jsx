// Admin notification bell with unread count and quick actions.
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../services/adminApi.js";

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ items: [], unread: 0 });
  const ref = useRef(null);
  const load = () => adminApi.notifications("?limit=5").then(setData).catch(() => {});

  useEffect(() => { load(); const timer = window.setInterval(load, 30000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);

  const markAll = async () => { await adminApi.markAllNotificationsRead(); await load(); };

  return <div ref={ref} className="relative"><button type="button" onClick={() => setOpen((value) => !value)} className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-linen"><Bell size={18} />{data.unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-bold text-white">{data.unread}</span>}</button>{open && <div className="absolute right-0 mt-2 w-[min(360px,calc(100vw-24px))] rounded-xl border border-[var(--admin-border)] bg-white p-2 shadow-soft"><div className="flex items-center justify-between px-2 py-2"><p className="text-sm font-bold">Notifications</p><button type="button" onClick={markAll} className="text-xs font-bold text-[var(--admin-primary)]">Mark all read</button></div><div className="max-h-80 overflow-y-auto">{data.items?.length ? data.items.map((item) => <Link key={item._id} to={item.related?.path || "/admin/notifications"} onClick={() => { adminApi.markNotification(item._id, true).then(load); setOpen(false); }} className={`block rounded-lg p-3 text-sm transition hover:bg-linen ${item.read ? "text-ink/60" : "bg-linen/70 text-ink"}`}><span className="block font-bold">{item.title}</span><span className="mt-1 line-clamp-2 text-xs text-ink/55">{item.description}</span><span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-ink/35">{item.category}</span></Link>) : <p className="p-4 text-center text-sm text-ink/50">No notifications</p>}</div><Link to="/admin/notifications" onClick={() => setOpen(false)} className="mt-2 block rounded-lg bg-ink px-3 py-2 text-center text-sm font-bold text-white">View All</Link></div>}</div>;
}
