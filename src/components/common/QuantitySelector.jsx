// Shared QuantitySelector component used across pages.
import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange }) {
  return (
    <div className="inline-flex h-12 overflow-hidden rounded-xl border border-ink/10 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="grid w-11 place-items-center text-ink/70 transition hover:bg-linen hover:text-ink"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus size={16} />
      </button>
      <span className="grid w-12 place-items-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid w-11 place-items-center text-ink/70 transition hover:bg-linen hover:text-ink"
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
