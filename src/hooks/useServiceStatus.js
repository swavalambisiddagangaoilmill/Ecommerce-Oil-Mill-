// Provides frontend components with current external service availability.
import { useEffect, useState } from "react";
import { fetchServiceStatus, getFallbackServiceStatus } from "../services/serviceStatusService.js";

export function useServiceStatus() {
  const [status, setStatus] = useState(() => getFallbackServiceStatus());

  useEffect(() => {
    let active = true;
    const load = () => fetchServiceStatus().then((data) => { if (active) setStatus(data); });
    load();
    const timer = window.setInterval(load, 60000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  return status;
}

export function useServiceAvailable(name) {
  const status = useServiceStatus();
  return status.services?.[name]?.available !== false;
}
