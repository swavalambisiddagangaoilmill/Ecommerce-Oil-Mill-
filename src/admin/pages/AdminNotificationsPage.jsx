// Dedicated admin notification management page.
import { Bell, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminBadge, AdminButton, AdminPageHeader, AdminTable } from "../components/AdminUi.jsx";
import { adminApi } from "../services/adminApi.js";

const statusText = (value) => String(value || "-").replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

function Cell({ children }) {
  return <td className="whitespace-nowrap px-4 py-3 align-middle">{children}</td>;
}

export default function AdminNotificationsPage() {
  const [data, setData] = useState({ items: [], unread: 0 });
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); setData(await adminApi.notifications("?limit=100")); setLoading(false); };
  useEffect(() => { load(); }, []);
  const mark = async (id, read) => { await adminApi.markNotification(id, read); load(); };
  const remove = async (id) => { await adminApi.deleteNotification(id); load(); };
  const markAll = async () => { await adminApi.markAllNotificationsRead(); load(); };
  const clearRead = async () => { await adminApi.clearReadNotifications(); load(); };

  return <><AdminPageHeader title="Notifications" description="Review admin alerts across orders, payments, inventory, customers, security, and system events." action={<div className="flex gap-2"><AdminButton variant="secondary" onClick={markAll}>Mark All Read</AdminButton><AdminButton variant="secondary" onClick={clearRead}>Clear Read</AdminButton></div>} />{loading ? <div className="rounded-xl bg-white p-6 text-sm font-semibold text-ink/55">Loading...</div> : <AdminTable columns={["", "Title", "Category", "Related", "Status", "Time", "Actions"]} rows={data.items.map((item) => <tr key={item._id}><Cell><Bell size={16} className={item.read ? "text-ink/35" : "text-leaf"} /></Cell><Cell><p className="font-bold">{item.title}</p><p className="max-w-md truncate text-xs text-ink/55">{item.description}</p></Cell><Cell>{statusText(item.category)}</Cell><Cell>{item.related?.path ? <Link className="font-bold text-leaf" to={item.related.path}>{item.related.label || item.related.kind}</Link> : item.related?.label || "-"}</Cell><Cell><AdminBadge>{item.read ? "Read" : "New"}</AdminBadge></Cell><Cell>{new Date(item.createdAt).toLocaleString("en-IN")}</Cell><Cell><div className="flex gap-2"><AdminButton variant="secondary" onClick={() => mark(item._id, !item.read)}>{item.read ? "Mark Unread" : "Mark Read"}</AdminButton><AdminButton variant="danger" onClick={() => remove(item._id)}><Trash2 size={14} /></AdminButton></div></Cell></tr>)} empty="No notifications found." />}</>;
}
