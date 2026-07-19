// Renders the email verification result page.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import { verifyEmailRequest } from "../services/authService.js";

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    verifyEmailRequest(token).then(() => setMessage("Email verified successfully.")).catch((err) => setMessage(err.message || "Verification link is invalid or expired."));
  }, [token]);

  return (
    <section className="grid min-h-[70vh] place-items-center px-4 py-12">
      <Container className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">Account security</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold">Email Verification</h1>
        <p className="mt-5 leading-7 text-ink/65">{message}</p>
        <Link to="/account" className="mt-7 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-bold text-white transition hover:bg-leaf">Go to Account</Link>
      </Container>
    </section>
  );
}
