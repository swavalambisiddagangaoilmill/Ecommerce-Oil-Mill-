// Placeholder wrapper for unauthorized route handling.
import StatusPage from "../../pages/StatusPage.jsx";

export default function ProtectedRoute({ allowed = true, children }) {
  // Backend integration required here: replace allowed with real auth/session checks.
  return allowed ? children : <StatusPage code="401" retry />;
}
