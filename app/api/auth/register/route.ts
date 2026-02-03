import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Rate limiting - strict for auth endpoints
  const clientId = getClientIdentifier(request);
  const rateLimitResult = rateLimit(clientId, RATE_LIMITS.auth);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user with default white belt and belt history
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        beltHistory: {
          create: {
            belt: 'white',
            achievedAt: new Date(),
          },
        },
      },
    });

    // Create token
    const token = createToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, belt: user.belt },
      message: 'Registration successful',
    });

    response.cookies.set(setAuthCookie(token));

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
