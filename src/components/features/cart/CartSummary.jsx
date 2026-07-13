// Renders CartSummary for cart and checkout flows.
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";

export default function CartSummary({ totals, showCheckout = true }) {
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const minimumOrder = 500;
  const belowMinimum = totals.subtotal > 0 && totals.subtotal < minimumOrder;

  const applyCoupon = () => {
    setCouponMessage(coupon.trim() ? "Coupon is invalid or expired." : "Enter a coupon code first.");
  };

  return (
    <aside className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-3xl font-semibold">Order Summary</h2>
      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span className="font-semibold">{formatCurrency(totals.subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-ink/60">Savings</span><span className="font-semibold text-leaf">-{formatCurrency(totals.discount)}</span></div>
        <div className="flex justify-between"><span className="text-ink/60">Shipping</span><span className="font-semibold">{totals.shipping ? formatCurrency(totals.shipping) : "Free"}</span></div>
        <div className="flex justify-between"><span className="text-ink/60">Estimated tax</span><span className="font-semibold">{formatCurrency(totals.tax)}</span></div>
      </div>
      {showCheckout && (
        <div className="mt-6 grid gap-2">
          <div className="flex gap-2"><Input className="flex-1" placeholder="Coupon code" aria-label="Coupon code" value={coupon} onChange={(event) => setCoupon(event.target.value)} /><Button type="button" variant="outline" className="h-[52px] px-4" onClick={applyCoupon}>Apply</Button></div>
          {couponMessage && <p className="text-sm font-semibold text-danger">{couponMessage}</p>}
          {belowMinimum && <p className="text-sm font-semibold text-clay">Minimum order is {formatCurrency(minimumOrder)}.</p>}
          <p className="text-sm text-ink/55">Delivery estimate: 2-5 business days after confirmation.</p>
        </div>
      )}
      <div className="mt-6 flex justify-between border-t border-ink/10 pt-5 text-lg font-bold"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
      {showCheckout && <Button to="/checkout" className="mt-6 w-full">Checkout</Button>}
      {showCheckout && <Link to="/shop" className="mt-4 block text-center text-sm font-semibold text-leaf">Continue shopping</Link>}
    </aside>
  );
}
