// Renders CheckoutForm for cart and checkout flows.
import { CreditCard, Home, Truck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { writeGuestSession } from "../../utils/guestSession.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, totals, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    const address = `${form.get("street")}, ${form.get("city")}, ${form.get("state")} ${form.get("pin")}`;
    // Backend: call createOrder with customer, shipping, payment, and cart payload here.
    setLoading(true);
    window.setTimeout(() => {
      const order = {
        id: `VEL-${Date.now().toString().slice(-6)}`,
        date: new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date()),
        paymentStatus: form.get("payment") === "cod" ? "Cash on delivery" : "Payment pending",
        address,
        items,
        total: totals.total,
        estimatedDelivery: "2-5 business days",
      };
      writeGuestSession({ checkoutDraft: {} });
      clearCart();
      navigate("/order/success", { state: { order } });
    }, 700);
  };

  return (
    <form className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <h1 className="font-serif text-4xl font-semibold">Checkout</h1>
      <p className="mt-3 text-sm font-semibold text-ink/55">Order total: {formatCurrency(totals.total)}</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Input label="First name" name="firstName" required />
        <Input label="Last name" name="lastName" required />
        <Input label="Email" name="email" type="email" required />
        <Input label="Phone" name="phone" type="tel" required />
      </div>
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Home size={20} /> Shipping Address</h2>
        <div className="grid gap-5">
          <Input label="Street address" name="street" required />
          <div className="grid gap-5 sm:grid-cols-3">
            <Input label="City" name="city" required />
            <Input label="State" name="state" required />
            <Input label="PIN code" name="pin" required />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Truck size={20} /> Shipping</h2>
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-leaf bg-leaf/5 p-4">
          <span><span className="block font-semibold">Fresh batch delivery</span><span className="text-sm text-ink/55">2-5 business days</span></span>
          <input type="radio" name="shipping" value="fresh" defaultChecked />
        </label>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><CreditCard size={20} /> Payment</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="rounded-2xl border border-leaf bg-leaf/5 p-4 font-semibold"><input type="radio" name="payment" value="online" defaultChecked className="mr-2" /> UPI / Cards</label>
          <label className="rounded-2xl border border-ink/10 p-4 font-semibold"><input type="radio" name="payment" value="cod" className="mr-2" /> Cash on delivery</label>
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
