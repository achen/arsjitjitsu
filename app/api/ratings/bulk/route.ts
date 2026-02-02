import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// POST /api/ratings/bulk - Create/update multiple ratings at once
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
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
              userId: payload.userId,
              techniqueId,
            },
          },
          update: {
            rating,
          },
          create: {
            userId: payload.userId,
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
