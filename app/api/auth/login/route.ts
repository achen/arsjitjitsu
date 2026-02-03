import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limiting - strict for auth endpoints to prevent brute force
  const clientId = getClientIdentifier(request);
  const rateLimitResult = rateLimit(clientId, RATE_LIMITS.auth);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create token
    const token = createToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        belt: user.belt,
      },
      message: 'Login successful',
    });

    response.cookies.set(setAuthCookie(token));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
