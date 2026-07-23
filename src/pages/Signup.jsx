// Renders the Signup page experience with frontend validation.
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/features/auth/GoogleSignInButton.jsx";
import TurnstileWidget from "../components/features/auth/TurnstileWidget.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";

function normalizeIndianMobile(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function mapBackendFieldErrors(error) {
  return (error.errors || error.payload?.errors || []).reduce((acc, item) => {
    const field = item.field || item.param || item.path;
    if (field && item.message) acc[field] = item.message;
    return acc;
  }, {});
}

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle } = useAuth();
  const firstFieldRef = useRef(null);
  const phoneRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const strength = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/\d/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);

  const validationErrors = useMemo(() => {
    const phone = normalizeIndianMobile(form.phone);
    return {
      name: !form.name.trim() ? "Full name is required." : form.name.trim().length < 2 ? "Enter your full name." : "",
      email: !form.email.trim() ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? "Enter a valid email." : "",
      phone: !form.phone.trim() ? "Phone number is required." : !/^[6-9]\d{9}$/.test(phone) ? "Enter a valid 10-digit mobile number." : "",
      password: !form.password ? "Password is required." : strength < 3 ? "Use at least 8 characters with uppercase and a number." : "",
      confirm: !form.confirm ? "Confirm password is required." : form.confirm !== form.password ? "Passwords do not match." : "",
    };
  }, [form, strength]);

  const visibleErrors = useMemo(() => {
    const errors = { ...serverErrors };
    if (!submitted) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        if (form[field] && message) errors[field] = message;
      });
      return errors;
    }
    Object.entries(validationErrors).forEach(([field, message]) => {
      if (message) errors[field] = message;
    });
    return errors;
  }, [form, serverErrors, submitted, validationErrors]);

  const fieldClass = (field) => visibleErrors[field] ? "border-danger focus:border-danger focus:ring-danger/10" : "";
  const update = (key) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setServerErrors((current) => ({ ...current, [key]: "" }));
  };
  const handleTurnstile = useCallback((token) => setTurnstileToken(token), []);
  const afterSignup = () => navigate(location.state?.from || "/account", { replace: true });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setSubmitted(true);
    setServerErrors({});
    setSubmitError("");

    const nextErrors = validationErrors;
    if (Object.values(nextErrors).some(Boolean)) {
      if (nextErrors.phone) phoneRef.current?.focus();
      else firstFieldRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: normalizeIndianMobile(form.phone),
        password: form.password,
        turnstileToken,
      });
      setSuccess(true);
      afterSignup();
    } catch (err) {
      const fieldErrors = mapBackendFieldErrors(err);
      setSuccess(false);
      setServerErrors(fieldErrors);
      setSubmitError(Object.keys(fieldErrors).length ? "" : err.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    if (!credential || loading) return;
    setLoading(true);
    setSubmitError("");
    try {
      await loginWithGoogle({ credential, remember: true });
      afterSignup();
    } catch (err) {
      setSubmitError(err.message || "Google signup failed. Please try again.");
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
          <div className="mt-7"><GoogleSignInButton onCredential={handleGoogle} disabled={loading} /></div>
          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-ink/35"><span className="h-px flex-1 bg-ink/10" />OR<span className="h-px flex-1 bg-ink/10" /></div>
          {success && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-leaf">Account created successfully. Please verify your email.</p>}
          {submitError && <p className="mt-5 rounded-2xl bg-linen p-4 text-sm font-semibold text-danger">{submitError}</p>}
          <div className="mt-7 grid gap-5">
            <Input inputRef={firstFieldRef} label="Full Name" value={form.name} onChange={update("name")} required autoFocus aria-invalid={!!visibleErrors.name} className={fieldClass("name")} />
            {visibleErrors.name && <p className="-mt-3 text-sm font-semibold text-danger">{visibleErrors.name}</p>}
            <Input label="Email" type="email" value={form.email} onChange={update("email")} required aria-invalid={!!visibleErrors.email} className={fieldClass("email")} />
            {visibleErrors.email && <p className="-mt-3 text-sm font-semibold text-danger">{visibleErrors.email}</p>}
            <Input inputRef={phoneRef} label="Phone Number" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={update("phone")} required aria-invalid={!!visibleErrors.phone} className={fieldClass("phone")} />
            {visibleErrors.phone && <p className="-mt-3 text-sm font-semibold text-danger">{visibleErrors.phone}</p>}
            <div>
              <div className="relative">
                <Input label="Password" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} required aria-invalid={!!visibleErrors.password} className={fieldClass("password")} />
                <button type="button" aria-label="Show or hide password" onClick={() => setShowPassword((current) => !current)} className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-linen text-ink">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Password strength">{Array.from({ length: 4 }).map((_, index) => <span key={index} className={`h-1.5 rounded-full ${index < strength ? "bg-leaf" : "bg-ink/10"}`} />)}</div>
              {visibleErrors.password && <p className="mt-2 text-sm font-semibold text-danger">{visibleErrors.password}</p>}
            </div>
            <Input label="Confirm Password" type={showPassword ? "text" : "password"} value={form.confirm} onChange={update("confirm")} required aria-invalid={!!visibleErrors.confirm} className={fieldClass("confirm")} />
            {visibleErrors.confirm && <p className="-mt-3 text-sm font-semibold text-danger">{visibleErrors.confirm}</p>}
            <TurnstileWidget onVerify={handleTurnstile} className="min-h-[65px]" />
          </div>
          <Button type="submit" className="mt-7 w-full" loading={loading}>Create Account</Button>
          <p className="mt-4 text-center text-sm leading-6 text-ink/60">By creating an account, you agree to our <Link to="/legal/terms" className="font-bold text-leaf">Terms & Conditions</Link> and <Link to="/legal/privacy" className="font-bold text-leaf">Privacy Policy</Link>.</p>
          <p className="mt-4 text-center text-sm text-ink/60">Already have an account? <Link to="/login" className="font-bold text-leaf">Login</Link></p>
        </form>
      </Container>
    </section>
  );
}
