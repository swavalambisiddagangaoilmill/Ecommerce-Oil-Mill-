// Exposes cart context to UI components.
import { useCartContext } from "../context/CartContext.jsx";

export function useCart() {
  return useCartContext();
}
