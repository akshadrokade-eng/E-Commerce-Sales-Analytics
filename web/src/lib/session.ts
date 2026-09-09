const SESSION_KEY = '__ecommerce_session_id';

function generateSessionId(): string {
  return crypto.randomUUID();
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getSessionId(): string {
  return getOrCreateSessionId();
}
