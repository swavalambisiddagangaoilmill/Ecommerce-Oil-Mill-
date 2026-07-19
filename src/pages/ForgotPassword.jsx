// Renders the Forgot Password request page.
import { ChevronLeft } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import TurnstileWidget from "../components/features/auth/TurnstileWidget.jsx";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";
import { forgotPasswordRequest } from "../services/authService.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstile = useCallback((token) => setTurnstileToken(token), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const email = new FormData(event.currentTarget).get("email");
    setLoading(true);
    setMessage("");
    try {
      await forgotPasswordRequest({ email, turnstileToken });
      setMessage("If an account exists, a secure reset link has been sent.");
      event.currentTarget.reset();
    } catch (err) {
      setMessage(err.message || "Unable to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative grid min-h-[100dvh] place-items-center px-4 py-10">
      <button type="button" onClick={() => navigate(-1)} className="absolute left-4 top-4 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink shadow-sm transition hover:bg-linen sm:left-6 sm:top-6"><ChevronLeft size={17} /> Back</button>
      <Container className="grid place-items-center">
        <form className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Password recovery</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Forgot Password</h1>
          <p className="mt-4 leading-7 text-ink/60">Enter your email and we will send a secure reset link.</p>
          {message && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-ink/65">{message}</p>}
          <div className="mt-7 grid gap-5"><Input label="Email" name="email" type="email" required autoFocus /><TurnstileWidget onVerify={handleTurnstile} className="min-h-[65px]" /></div>
          <Button type="submit" className="mt-7 w-full" loading={loading}>Send Reset Link</Button>
        </form>
      </Container>
    </section>
  );
}
