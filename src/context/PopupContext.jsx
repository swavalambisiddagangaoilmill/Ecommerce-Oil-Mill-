// Coordinates floating popups so only one overlay is open at a time.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const PopupContext = createContext(null);

export function PopupProvider({ children }) {
  const [activePopup, setActivePopup] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setActivePopup(null);
  }, [location.pathname, location.search]);

  const value = useMemo(
    () => ({
      activePopup,
      closePopups: () => setActivePopup(null),
      togglePopup: (name) => setActivePopup((current) => (current === name ? null : name)),
      openPopup: (name) => setActivePopup(name),
    }),
    [activePopup],
  );

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within PopupProvider");
  }
  return context;
}
