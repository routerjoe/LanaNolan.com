/**
 * NOTE:
 * Avoid importing from 'next/server' here to work around a Turbopack dev alias bug
 * resolving an internal 'next-response' export. We only use standard Web Response
 * APIs and let middleware continue by returning nothing.
 */

const getExpectedToken = () =>
  process.env.ADMIN_TOKEN || process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev-admin-token';

// Minimal request typing to avoid importing next/server in middleware (works in edge/runtime)
type MinimalCookies = { get?: (name: string) => { value?: string } | undefined };
type MinimalHeaders = { get: (name: string) => string | null };
interface MinimalRequest {
  url: string;
  nextUrl?: { pathname?: string };
  headers: MinimalHeaders;
  cookies?: MinimalCookies;
}
export function middleware(req: MinimalRequest) {
  const pathname: string = req.nextUrl?.pathname || new URL(req.url).pathname;

  const expected = getExpectedToken();
  const authHeader = req.headers.get('authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const cookieToken = req.cookies?.get?.('admin_token')?.value || '';
  const token = bearer || cookieToken;

  // Optional server-side redirect guard for /admin (env-gated)
  const redirectGuard =
    process.env.ADMIN_GUARD_REDIRECT === 'true' ||
    process.env.NEXT_PUBLIC_ADMIN_GUARD_REDIRECT === 'true';

  if (redirectGuard && pathname === '/admin') {
    if (!token || token !== expected) {
      const url = new URL(req.url);
      url.pathname = '/';
      url.searchParams.set('unauthorized', '1');
      return Response.redirect(url.toString(), 302);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!token || token !== expected) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  // Return nothing to continue to the next middleware/route.
  return;
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin'],
};