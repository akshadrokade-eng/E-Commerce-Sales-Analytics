let _sessionId: string | null = null;

export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server-ssr';
  }
  if (!_sessionId) {
    _sessionId = crypto.randomUUID();
  }
  return _sessionId;
}
