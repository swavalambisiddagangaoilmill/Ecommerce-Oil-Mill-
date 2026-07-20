// Displays a self-XSS warning in the browser console.
export function showConsoleSecurityWarning() {
  if (typeof window === "undefined" || window.__VELORA_CONSOLE_WARNING_SHOWN__) return;
  window.__VELORA_CONSOLE_WARNING_SHOWN__ = true;
  window.console.log("%cSTOP", "color:#b91c1c;font-size:48px;font-weight:800;line-height:1.2");
  window.console.log("%cThis browser console is for developers. Do not paste code you do not understand. It may allow attackers to access your account or order data.", "color:#3f2b1f;font-size:14px;font-weight:600");
}