// Protects admin routes with a dedicated admin sign-in flow.
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { clearAuthTokens } from "../../api/apiClient.js";
import AdminAccessDenied from "../pages/AdminAccessDenied.jsx";
import AdminSignIn from "../pages/AdminSignIn.jsx";
import { adminAuthApi } from "../services/adminApi.js";

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, user: null, denied: false });
  useEffect(() => {
    let active = true;
    setState({ loading: true, user: null, denied: false });
    adminAuthApi.profile().then((data) => {
      if (active) setState({ loading: false, user: data.user, denied: false });
    }).catch((err) => {
      if (!active) return;
      if (/admin access/i.test(err.message || "")) setState({ loading: false, user: null, denied: true });
      else { clearAuthTokens(); setState({ loading: false, user: null, denied: false }); }
    });
    return () => { active = false; };
  }, [location.pathname]);
  if (state.loading) return null;
  if (state.denied) return <AdminAccessDenied />;
  if (!state.user) return <AdminSignIn />;
  return children;
}
