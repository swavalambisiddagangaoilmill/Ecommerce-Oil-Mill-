// Renders the Signup page experience with frontend validation.
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { registerAccount } from "../services/authService.js";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const firstFieldRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const strength = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/\d/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);

  const errors = {
    name: form.name && form.name.length < 2 ? "Enter your full name." : "",
    email: form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "Enter a valid email." : "",
    confirm: form.confirm && form.confirm !== form.password ? "Passwords do not match." : "",
  };

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || Object.values(errors).some(Boolean) || strength < 2) return;
    setLoading(true);
    setSubmitError("");
    try {
      await registerAccount({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      setSuccess(true);
      navigate("/", { replace: true });
    } catch (err) {
      setSuccess(false);
      setSubmitError(err.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative grid min-h-[100dvh] place-items-center px-4 py-10">
      <button type="button" onClick={() => navigate(-1)} className="absolute left-4 top-4 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink shadow-sm transition hover:bg-linen sm:left-6 sm:top-6"><ChevronLeft size={17} /> Back</button>
      <Container className="grid place-items-center">
        <form className="w-full max-w-lg rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit} noValidate>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Create account</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Sign Up</h1>
          <p className="mt-4 leading-7 text-ink/60">Save your cart, wishlist, addresses, and order history permanently.</p>
          {success && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-leaf">Account created successfully.</p>}
          {submitError && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-danger">{submitError}</p>}
          <div className="mt-7 grid gap-5">
            <Input inputRef={firstFieldRef} label="Full Name" value={form.name} onChange={update("name")} required autoFocus aria-invalid={!!errors.name} />
            {errors.name && <p className="-mt-3 text-sm font-semibold text-danger">{errors.name}</p>}
            <Input label="Email" type="email" value={form.email} onChange={update("email")} required aria-invalid={!!errors.email} />
            {errors.email && <p className="-mt-3 text-sm font-semibold text-danger">{errors.email}</p>}
            <Input label="Phone (optional)" type="tel" value={form.phone} onChange={update("phone")} />
            <div>
              <div className="relative">
                <Input label="Password" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} required />
                <button type="button" aria-label="Show or hide password" onClick={() => setShowPassword((current) => !current)} className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-linen text-ink">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Password strength">{Array.from({ length: 4 }).map((_, index) => <span key={index} className={`h-1.5 rounded-full ${index < strength ? "bg-leaf" : "bg-ink/10"}`} />)}</div>
            </div>
            <Input label="Confirm Password" type={showPassword ? "text" : "password"} value={form.confirm} onChange={update("confirm")} required aria-invalid={!!errors.confirm} />
            {errors.confirm && <p className="-mt-3 text-sm font-semibold text-danger">{errors.confirm}</p>}
          </div>
          <Button type="submit" className="mt-7 w-full" loading={loading}>Create Account</Button>
          <p className="mt-4 text-center text-sm leading-6 text-ink/60">By creating an account, you agree to our <Link to="/legal/terms" className="font-bold text-leaf">Terms & Conditions</Link> and <Link to="/legal/privacy" className="font-bold text-leaf">Privacy Policy</Link>.</p>
          <p className="mt-4 text-center text-sm text-ink/60">Already have an account? <Link to="/login" className="font-bold text-leaf">Login</Link></p>
        </form>
      </Container>
    </section>
  );
}





