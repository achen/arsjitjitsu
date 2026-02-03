import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  const rateLimitResult = rateLimit(clientId, RATE_LIMITS.api);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
