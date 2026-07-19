// Renders the Reset Password page for secure emailed tokens.
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";
import { resetPasswordRequest } from "../services/authService.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirm")) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await resetPasswordRequest(token, { password: form.get("password") });
      setMessage("Password reset successfully. Redirecting...");
      window.setTimeout(() => navigate("/account", { replace: true }), 600);
    } catch (err) {
      setMessage(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative grid min-h-[100dvh] place-items-center px-4 py-10">
      <button type="button" onClick={() => navigate(-1)} className="absolute left-4 top-4 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink shadow-sm transition hover:bg-linen sm:left-6 sm:top-6"><ChevronLeft size={17} /> Back</button>
      <Container className="grid place-items-center">
        <form className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Secure reset</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Reset Password</h1>
          {message && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-ink/65">{message}</p>}
          <div className="mt-7 grid gap-5">
            <div className="relative"><Input label="New password" name="password" type={showPassword ? "text" : "password"} required /><button type="button" aria-label="Show or hide password" onClick={() => setShowPassword((current) => !current)} className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-linen text-ink">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            <Input label="Confirm password" name="confirm" type={showPassword ? "text" : "password"} required />
          </div>
          <Button type="submit" className="mt-7 w-full" loading={loading}>Reset Password</Button>
        </form>
      </Container>
    </section>
  );
}
