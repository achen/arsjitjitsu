import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  const rateLimitResult = rateLimit(clientId, RATE_LIMITS.api);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set(clearAuthCookie());
  return response;
}
