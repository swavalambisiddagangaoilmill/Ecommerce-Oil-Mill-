// Adds client-side deterrents and reports repeated suspicious activity.
import { useEffect, useRef, useState } from "react";
import { reportSecurityActivity } from "../../../services/securityService.js";

const warningThreshold = 6;
const restrictionThreshold = 12;
const blockedKeys = new Set(["F12"]);
const blockedCombos = [
  (event) => event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(event.key.toUpperCase()),
  (event) => event.ctrlKey && ["U"].includes(event.key.toUpperCase()),
];

function getDeviceId() {
  const key = "ss_oil_mill_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID?.() || `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function SecurityAwareness() {
  const [warning, setWarning] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [restrictedUntil, setRestrictedUntil] = useState("");
  const localCountRef = useRef(0);
  const lastReportRef = useRef(0);
  const signalReportRef = useRef({});

  useEffect(() => {
    const deviceId = getDeviceId();
    const report = async (signal) => {
      localCountRef.current += 1;
      const count = localCountRef.current;
      if (count >= warningThreshold) setWarning(true);
      const now = Date.now();
      const lastSignalReport = signalReportRef.current[signal] || 0;
      const signalCooldown = signal === "devtools_size" ? 30000 : 5000;
      if (count < 3 || now - lastReportRef.current < 1800 || now - lastSignalReport < signalCooldown) return;
      lastReportRef.current = now;
      signalReportRef.current[signal] = now;
      const response = await reportSecurityActivity(signal, deviceId).catch(() => null);
      if (response?.warning) setWarning(true);
      if (response?.restricted) {
        setRestricted(true);
        setRestrictedUntil(response.restrictedUntil || "");
      }
    };

    const observeContextMenu = (event) => {
      report("context_menu");
      if (localCountRef.current >= restrictionThreshold) event.preventDefault();
    };
    const observeKeyboard = (event) => {
      if (blockedKeys.has(event.key) || blockedCombos.some((match) => match(event))) {
        report(`key_${event.key}`);
        if (localCountRef.current >= warningThreshold) event.preventDefault();
      }
    };
    const checkDevTools = () => {
      const opened = window.outerWidth - window.innerWidth > 180 || window.outerHeight - window.innerHeight > 180;
      if (opened) report("devtools_size");
    };

    document.addEventListener("contextmenu", observeContextMenu);
    document.addEventListener("keydown", observeKeyboard);
    const interval = window.setInterval(checkDevTools, 3500);
    return () => {
      document.removeEventListener("contextmenu", observeContextMenu);
      document.removeEventListener("keydown", observeKeyboard);
      window.clearInterval(interval);
    };
  }, []);

  if (restricted) {
    return (
      <div className="fixed inset-0 z-[220] grid place-items-center bg-cream px-5 text-center text-ink">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="font-serif text-4xl font-semibold">Access Restricted</h1>
          <p className="mt-4 leading-7 text-ink/65">Repeated unusual browser activity was detected. Please return later or contact support if this was a mistake.</p>
          {restrictedUntil && <p className="mt-4 text-sm font-semibold text-ink/45">Restriction ends after {new Date(restrictedUntil).toLocaleString()}.</p>}
        </div>
      </div>
    );
  }

  if (!warning) return null;

  return (
    <div className="fixed left-1/2 top-4 z-[130] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-clay/20 bg-white p-4 text-center text-sm font-semibold text-ink shadow-soft">
      Unusual browser activity was noticed. Some actions may be restricted if it continues.
    </div>
  );
}
