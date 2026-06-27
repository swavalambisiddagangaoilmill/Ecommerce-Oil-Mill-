// Composes app-wide providers in one place.
import IntroLoader from "../components/feedback/IntroLoader.jsx";
import { ToastProvider } from "../components/feedback/ToastProvider.jsx";
import { CartProvider } from "../context/CartContext.jsx";
import { PopupProvider } from "../context/PopupContext.jsx";
import { WishlistProvider } from "../context/WishlistContext.jsx";

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <PopupProvider>
          <CartProvider>
            <IntroLoader />
            {children}
          </CartProvider>
        </PopupProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
