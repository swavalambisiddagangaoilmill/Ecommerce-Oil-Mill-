// Renders CheckoutForm for cart and checkout flows.
import { CreditCard, Home, Truck } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";

export default function CheckoutForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Backend: call createOrder with customer, shipping, payment, and cart payload here.
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <form className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      {submitted && (
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-linen p-4 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center gap-2" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                className={`h-2 w-2 animate-[confetti-soft_900ms_ease-out_forwards] rounded-full ${index % 3 === 0 ? "bg-leaf" : index % 3 === 1 ? "bg-clay" : "bg-olive"}`}
                style={{ animationDelay: `${index * 45}ms` }}
              />
            ))}
          </div>
          <p className="font-serif text-3xl font-semibold">Order placed successfully</p>
          <p className="mt-2 text-sm text-ink/60">Payment success, failure, and pending states are available under payment routes.</p>
        </div>
      )}
      <h1 className="font-serif text-4xl font-semibold">Checkout</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Input label="First name" required />
        <Input label="Last name" required />
        <Input label="Email" type="email" required />
        <Input label="Phone" type="tel" required />
      </div>
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Home size={20} /> Shipping Address</h2>
        <div className="grid gap-5">
          <Input label="Street address" required />
          <div className="grid gap-5 sm:grid-cols-3">
            <Input label="City" required />
            <Input label="State" required />
            <Input label="PIN code" required />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Truck size={20} /> Shipping</h2>
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-leaf bg-leaf/5 p-4">
          <span><span className="block font-semibold">Fresh batch delivery</span><span className="text-sm text-ink/55">2-5 business days</span></span>
          <input type="radio" name="shipping" defaultChecked />
        </label>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><CreditCard size={20} /> Payment</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="rounded-2xl border border-leaf bg-leaf/5 p-4 font-semibold"><input type="radio" name="payment" defaultChecked className="mr-2" /> UPI / Cards</label>
          <label className="rounded-2xl border border-ink/10 p-4 font-semibold"><input type="radio" name="payment" className="mr-2" /> Cash on delivery</label>
        </div>
      </div>
      <label className="mt-6 flex items-start gap-3 text-sm leading-6 text-ink/65">
        <input type="checkbox" required className="mt-1" />
        I agree to the Terms & Conditions, Privacy Policy, and Refund & Cancellation Policy.
      </label>
      <Button type="submit" className="mt-8 w-full" loading={loading}>Place Order</Button>
    </form>
  );
}
