/**
 * Validates a post-login in-app redirect (path + optional query/hash).
 * Returns null if the value is missing or unsafe (open redirect).
 */
export function safeAuthRedirectPath(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const s = decodeURIComponent(raw).trim()
  if (!s.startsWith('/') || s.startsWith('//')) return null
  const pathOnly = s.split('?')[0]?.split('#')[0] ?? ''
  if (!pathOnly || pathOnly === '/login' || pathOnly === '/confirm') return null
  return s
}
