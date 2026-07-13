// Guards routes that require an authenticated session.
import { getAuthToken } from "../../../api/apiClient.js";
import StatusPage from "../../../pages/StatusPage.jsx";

export default function ProtectedRoute({ allowed = true, children }) {
  const authenticated = Boolean(getAuthToken());
  return allowed && authenticated ? children : <StatusPage code="401" retry />;
}
