// Renders images with a consistent fallback if remote assets fail.
import { useState } from "react";

export default function SafeImage({ src, alt, className = "", fallbackClassName = "", ...props }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`grid place-items-center bg-linen text-center text-sm font-semibold text-ink/50 ${className} ${fallbackClassName}`}>
        Image unavailable
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}


