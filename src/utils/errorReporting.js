// Frontend error-reporting adapter for production monitoring tools.
export function reportFrontendError(error, context = {}) {
  if (import.meta.env.DEV) return;
  // Connect Sentry, LogRocket, or another approved monitoring provider here.
  void error;
  void context;
}