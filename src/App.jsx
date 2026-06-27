// Renders the global storefront shell.
import ErrorBoundary from "./components/feedback/ErrorBoundary.jsx";
import NetworkStatusBanner from "./components/feedback/NetworkStatusBanner.jsx";
import RouteTransitionLoader from "./components/feedback/RouteTransitionLoader.jsx";
import ScrollToTop from "./components/feedback/ScrollToTop.jsx";
import SecurityAwareness from "./components/feedback/SecurityAwareness.jsx";
import ChatWidget from "./components/widgets/ChatWidget.jsx";
import WishlistWidget from "./components/widgets/WishlistWidget.jsx";
import AnnouncementBar from "./components/layout/AnnouncementBar.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <ErrorBoundary>
        <ScrollToTop />
        <RouteTransitionLoader />
        <SecurityAwareness />
        <NetworkStatusBanner />
        <AnnouncementBar />
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
        <WishlistWidget />
        <ChatWidget />
      </ErrorBoundary>
    </div>
  );
}
