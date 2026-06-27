// Renders the Login page experience.
import { useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import Button from "../components/ui/Button.jsx";
import Container from "../components/ui/Container.jsx";
import Input from "../components/ui/Input.jsx";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Connect authentication endpoint here.
    setLoading(true);
    window.setTimeout(() => setLoading(false), 600);
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Login" }]} />
      <section className="section-padding">
        <Container className="grid place-items-center">
          <form className="w-full max-w-md rounded-3xl border border-ink/10 bg-white p-7 shadow-soft" onSubmit={handleSubmit}>
            <h1 className="font-serif text-5xl font-semibold">Welcome Back</h1>
            <p className="mt-4 leading-7 text-ink/60">Sign in to view orders, saved addresses, and batch recommendations.</p>
            <div className="mt-8 grid gap-5">
              <Input label="Email" type="email" required />
              <Input label="Password" type="password" required />
            </div>
            <div className="mt-5 flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink/60"><input type="checkbox" /> Remember me</label>
              <a href="#forgot" className="font-semibold text-leaf">Forgot Password?</a>
            </div>
            <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-ink/65">
              <input type="checkbox" required className="mt-1" />
              I agree to the Privacy Policy and Terms & Conditions.
            </label>
            <p className="mt-4 text-sm text-ink/55">Auth states covered: login required, access denied, session expired, email not verified.</p>
            <Button type="submit" className="mt-7 w-full" loading={loading}>Login</Button>
          </form>
        </Container>
      </section>
    </>
  );
}
