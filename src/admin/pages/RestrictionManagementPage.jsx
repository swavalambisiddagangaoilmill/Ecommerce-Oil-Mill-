// Super-admin page for reviewing and managing active visitor/account restrictions.
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../components/features/feedback/ToastProvider.jsx";
import { AdminBadge, AdminButton, AdminFilters, AdminInput, AdminModal, AdminPageHeader, AdminTable, AdminTextarea } from "../components/AdminUi.jsx";
import { adminApi } from "../services/adminApi.js";

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-";
}

function Cell({ children, className = "" }) {
  return <td className={`whitespace-nowrap px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function statusLabel(value) {
  return String(value || "-").replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function RestrictionManagementPage() {
  const { showToast } = useToast();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const pendingRef = useRef({});
  const [pending, setPending] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.restrictions(q);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || "Unable to load restrictions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 250);
    return () => window.clearTimeout(timer);
  }, [q]);

  const run = async (key, task, success) => {
    if (pendingRef.current[key]) return null;
    pendingRef.current[key] = true;
    setPending((current) => ({ ...current, [key]: true }));
    try {
      const result = await task();
      showToast(success, "success");
      return result;
    } catch (err) {
      showToast(err.message || "Action failed. Please try again.", "error");
      return null;
    } finally {
      pendingRef.current[key] = false;
      setPending((current) => ({ ...current, [key]: false }));
    }
  };

  const applyRestriction = (restriction) => {
    setSelected(restriction);
    setItems((current) => current.map((item) => item._id === restriction._id ? { ...item, ...restriction } : item));
  };

  const openDetails = async (id) => {
    const data = await run(`view:${id}`, () => adminApi.restriction(id), "Restriction details loaded.");
    if (data?.restriction) {
      setSelected(data.restriction);
      setAction("details");
    }
  };

  const close = () => {
    setAction(null);
    setReason("");
    setExpiresAt("");
  };

  const submitAction = async () => {
    if (!selected?._id) return;
    const key = `${action}:${selected._id}`;
    const labels = { remove: "Restriction removed.", extend: "Restriction extended.", note: "Restriction note saved." };
    const task = action === "remove"
      ? () => adminApi.removeRestriction(selected._id, reason)
      : action === "extend"
        ? () => adminApi.extendRestriction(selected._id, { expiresAt, reason })
        : () => adminApi.addRestrictionNote(selected._id, reason);
    const result = await run(key, task, labels[action]);
    if (result?.restriction) applyRestriction(result.restriction);
    if (result) close();
  };

  const rows = items.map((item) => <tr key={item._id}>
    <Cell className="font-bold">{item._id}</Cell>
    <Cell className="max-w-xs truncate">{item.reason}</Cell>
    <Cell>{statusLabel(item.type)}</Cell>
    <Cell><AdminBadge>{statusLabel(item.status)}</AdminBadge></Cell>
    <Cell>{formatDate(item.createdAt)}</Cell>
    <Cell>{formatDate(item.expiresAt)}</Cell>
    <Cell>{formatDate(item.lastActivityAt)}</Cell>
    <Cell>{item.country || "-"}</Cell>
    <Cell><div className="flex gap-2"><AdminButton variant="secondary" loading={pending[`view:${item._id}`]} onClick={() => openDetails(item._id)}>View</AdminButton><AdminButton variant="secondary" onClick={() => { setSelected(item); setAction("extend"); }}>Extend</AdminButton><AdminButton variant="danger" disabled={item.status !== "ACTIVE"} onClick={() => { setSelected(item); setAction("remove"); }}>Remove</AdminButton></div></Cell>
  </tr>);

  return <>
    <AdminPageHeader title="Restriction Management" description="Review and manage visitor or account restrictions after verification." />
    <AdminFilters>
      <AdminInput label="Search" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Email, IP, user ID, restriction ID" className="md:col-span-2" />
    </AdminFilters>
    {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
    {loading ? <div className="rounded-xl border border-[var(--admin-border)] bg-white p-6 text-sm font-semibold text-[var(--admin-muted)]">Loading...</div> : <AdminTable columns={["Restriction ID", "Reason", "Type", "Status", "Created", "Expiry", "Last Activity", "Country", "Actions"]} rows={rows} />}

    <AdminModal title="Restriction Details" open={action === "details"} onClose={close} footer={<><AdminButton variant="secondary" onClick={() => setAction("note")}>Add Note</AdminButton><AdminButton variant="secondary" onClick={() => setAction("extend")}>Extend</AdminButton><AdminButton variant="danger" disabled={selected?.status !== "ACTIVE"} onClick={() => setAction("remove")}>Remove</AdminButton></>}>
      {selected && <div className="grid gap-3 text-sm">
        {["_id", "reason", "type", "status", "ip", "deviceId", "fingerprint", "email", "country"].map((key) => <div key={key} className="rounded-xl bg-linen p-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">{key}</p><p className="mt-1 break-all font-semibold">{selected[key] || "-"}</p></div>)}
        <div className="rounded-xl bg-linen p-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/40">Notes</p>{(selected.internalNotes || []).length ? selected.internalNotes.map((note) => <p key={note._id} className="mt-2 text-sm"><span className="font-bold">{note.adminEmail}</span>: {note.note}</p>) : <p className="mt-1 text-ink/50">No notes yet.</p>}</div>
      </div>}
    </AdminModal>

    <AdminModal title="Confirm Remove Restriction" open={action === "remove"} onClose={close} footer={<><AdminButton variant="secondary" onClick={close}>Cancel</AdminButton><AdminButton variant="danger" disabled={reason.trim().length < 2} loading={pending[`remove:${selected?._id}`]} onClick={submitAction}>Remove Restriction</AdminButton></>}>
      <p className="mb-4 text-sm font-semibold text-ink/65">This removes the restriction immediately. Enter the verified admin reason.</p>
      <AdminTextarea label="Admin reason" value={reason} onChange={(event) => setReason(event.target.value)} />
    </AdminModal>

    <AdminModal title="Extend Restriction" open={action === "extend"} onClose={close} footer={<AdminButton disabled={!expiresAt || reason.trim().length < 2} loading={pending[`extend:${selected?._id}`]} onClick={submitAction}>Extend Restriction</AdminButton>}>
      <div className="grid gap-4"><AdminInput label="New expiry time" type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /><AdminTextarea label="Admin reason" value={reason} onChange={(event) => setReason(event.target.value)} /></div>
    </AdminModal>

    <AdminModal title="Add Internal Note" open={action === "note"} onClose={close} footer={<AdminButton disabled={reason.trim().length < 2} loading={pending[`note:${selected?._id}`]} onClick={submitAction}>Save Note</AdminButton>}>
      <AdminTextarea label="Internal admin note" value={reason} onChange={(event) => setReason(event.target.value)} />
    </AdminModal>
  </>;
}
