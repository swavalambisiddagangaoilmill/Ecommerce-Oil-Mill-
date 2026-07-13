// Manages versioned 48-hour guest session persistence.
const SESSION_KEY = "velora_guest_session_v1";
const SESSION_VERSION = 1;
const SESSION_TTL = 48 * 60 * 60 * 1000;

export const emptyGuestSession = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  aiPreferences: {},
  checkoutDraft: {},
  expirationNoticeDismissedAt: null,
};

function now() {
  return Date.now();
}

export function readGuestSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return { data: emptyGuestSession, expired: false, expiresAt: now() + SESSION_TTL };
    const session = JSON.parse(raw);
    if (session.version !== SESSION_VERSION || session.expiresAt <= now()) {
      window.localStorage.removeItem(SESSION_KEY);
      return { data: emptyGuestSession, expired: true, expiresAt: now() + SESSION_TTL };
    }
    return { data: { ...emptyGuestSession, ...session.data }, expired: false, expiresAt: session.expiresAt };
  } catch {
    return { data: emptyGuestSession, expired: false, expiresAt: now() + SESSION_TTL };
  }
}

export function writeGuestSession(partialData) {
  const current = readGuestSession().data;
  const session = {
    version: SESSION_VERSION,
    updatedAt: now(),
    expiresAt: now() + SESSION_TTL,
    data: { ...current, ...partialData },
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearGuestSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getGuestSessionMeta() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return { expiresAt: session.expiresAt, updatedAt: session.updatedAt };
  } catch {
    return null;
  }
}


