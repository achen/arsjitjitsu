import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

// POST /api/ratings/bulk - Create/update multiple ratings at once
export async function POST(request: NextRequest) {
  // Rate limiting for write operations
  const clientId = getClientIdentifier(request);
  const rateLimitResult = rateLimit(clientId, RATE_LIMITS.write);
  
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
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { techniqueIds, rating } = body;

    if (!Array.isArray(techniqueIds) || techniqueIds.length === 0) {
      return NextResponse.json(
        { error: 'Technique IDs array is required' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 0 || rating > 7) {
      return NextResponse.json(
        { error: 'Rating must be a number between 0 and 7' },
        { status: 400 }
      );
    }

    // Verify all techniques exist
    const techniques = await prisma.technique.findMany({
      where: { id: { in: techniqueIds } },
      select: { id: true }
    });

    if (techniques.length !== techniqueIds.length) {
      return NextResponse.json(
        { error: 'One or more techniques not found' },
        { status: 404 }
      );
    }

    // Upsert all ratings in a transaction
    const results = await prisma.$transaction(
      techniqueIds.map(techniqueId =>
        prisma.userRating.upsert({
          where: {
            userId_techniqueId: {
              userId: user.id,
              techniqueId,
            },
          },
          update: {
            rating,
          },
          create: {
            userId: user.id,
            techniqueId,
            rating,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      updated: results.length,
      rating
    });
  } catch (error) {
    console.error('Bulk ratings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
