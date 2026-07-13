// Renders the refined Login page experience.
import { ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";
import { loginAccount } from "../services/authService.js";

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    setError("");
    setLoading(true);
    try {
      await loginAccount({ email: form.get("email"), password: form.get("password") });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative grid min-h-[100dvh] place-items-center px-4 py-10">
      <button type="button" onClick={() => navigate(-1)} className="absolute left-4 top-4 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink shadow-sm transition hover:bg-linen sm:left-6 sm:top-6"><ChevronLeft size={17} /> Back</button>
      <Container className="grid place-items-center">
        <form className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit} noValidate>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Account access</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Welcome Back</h1>
          <p className="mt-4 leading-7 text-ink/60">Sign in to view orders, saved addresses, and batch recommendations.</p>
          <div className="mt-8 grid gap-5"><Input inputRef={emailRef} label="Email" name="email" type="email" required autoFocus /><Input label="Password" name="password" type="password" required /></div>
          <div className="mt-5 flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-ink/60"><input type="checkbox" /> Remember me</label><Link to="/auth/session-expired" className="font-semibold text-leaf">Forgot Password?</Link></div>
          {error && <p role="status" className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-ink/65">{error}</p>}
          <Button type="submit" className="mt-7 w-full" loading={loading}>Login</Button>
          <p className="mt-5 text-center text-sm text-ink/60">Don&apos;t have an account? <Link to="/signup" className="font-bold text-leaf">Sign Up</Link></p>
        </form>
      </Container>
    </section>
  );
}
