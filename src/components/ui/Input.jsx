// Reusable Input UI primitive.
export default function Input({ label, className = "", inputRef, ...props }) {
  return (
    <label className="block w-full">
      {label && <span className="mb-2 block text-sm font-semibold text-ink/75">{label}</span>}
      <input
        ref={inputRef}
        className={`h-[52px] w-full rounded-xl border border-ink/10 bg-white px-4 text-sm outline-none transition duration-300 placeholder:text-ink/35 focus:border-leaf focus:ring-4 focus:ring-leaf/10 ${className}`}
        {...props}
      />
    </label>
  );
}


