// Reusable Container UI primitive.
export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 ${className}`}>
      {children}
    </div>
  );
}


