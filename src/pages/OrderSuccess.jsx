// Renders the dedicated order success confirmation page.
import { CheckCircle, Download, ExternalLink, ShoppingBag } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;
  if (!order) return <Navigate to="/shop" replace />;

  const orderId = order._id || order.id;
  const items = order.items || order.products || [];
  const total = order.total || order.totalAmount || 0;
  const estimatedDelivery = order.estimatedDelivery || "After courier assignment";

  return (
    <section className="section-padding print:bg-white">
      <Container className="max-w-5xl">
        <div className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-8 print:shadow-none">
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-linen text-leaf"><CheckCircle size={30} /></span>
            <h1 className="mt-5 font-serif text-5xl font-semibold">Order Placed Successfully</h1>
            <p className="mt-3 text-ink/60">{order.trackingUrl ? "Your tracking link is ready." : "Tracking will appear once the courier is assigned."}</p>
            {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:bg-leaf">Track Order <ExternalLink size={16} className="ml-2" /></a>}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Order ID" value={orderId} />
            <Info label="Date & Time" value={order.date || new Date(order.createdAt || Date.now()).toLocaleString("en-IN")} />
            <Info label="Payment Status" value={order.paymentStatus} />
            <Info label="Estimated Delivery" value={estimatedDelivery} />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-3xl bg-cream p-5">
              <h2 className="font-serif text-3xl font-semibold">Ordered Products</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => {
                  const name = item.name || item.title;
                  const image = item.image;
                  const id = item.id || item.product || name;
                  return <div key={id} className="flex gap-4 rounded-2xl bg-white p-3">
                    <img src={image} alt={name} className="h-20 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm text-ink/55">Qty {item.quantity}{item.volume ? ` · ${item.volume}` : ""}</p>
                      <p className="mt-1 font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>;
                })}
              </div>
            </div>
            <div className="rounded-3xl bg-ink p-5 text-white">
              <h2 className="font-serif text-3xl font-semibold">Delivery Address</h2>
              <p className="mt-4 leading-7 text-white/70">{order.address || formatAddress(order.shippingAddress)}</p>
              {(order.courierName || order.awbCode) && <div className="mt-6 border-t border-white/10 pt-5 text-sm text-white/65">
                {order.courierName && <p>Courier: {order.courierName}</p>}
                {order.awbCode && <p className="mt-1">AWB: {order.awbCode}</p>}
              </div>}
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-white/50">Total Amount</p>
                <p className="mt-1 text-3xl font-bold">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
            <Link to="/shop" className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-bold text-white transition hover:bg-leaf"><ShoppingBag size={17} className="mr-2" /> Continue Shopping</Link>
            <Link to={`/account/orders/${orderId}`} className="inline-flex h-12 items-center justify-center rounded-full bg-linen px-6 text-sm font-bold text-ink transition hover:text-leaf">View Order</Link>
            <button type="button" onClick={() => window.print()} className="inline-flex h-12 items-center justify-center rounded-full border border-ink/10 px-6 text-sm font-bold text-ink transition hover:border-leaf hover:text-leaf"><Download size={17} className="mr-2" /> Download Invoice</button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function formatAddress(address) {
  if (!address) return "";
  return `${address.fullName}, ${address.phone}\n${address.street}, ${address.city}, ${address.state} ${address.postalCode}\n${address.country || "India"}`;
}

function Info({ label, value }) {
  return <div className="rounded-2xl bg-cream p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">{label}</p><p className="mt-2 font-semibold">{value}</p></div>;
}
