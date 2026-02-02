import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { techniqueId, rating, notes } = await request.json();

    if (!techniqueId || rating === undefined) {
      return NextResponse.json(
        { error: 'Technique ID and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 0 || rating > 7) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 7' },
        { status: 400 }
      );
    }

    // Check if technique exists
    const technique = await prisma.technique.findUnique({
      where: { id: techniqueId },
    });

    if (!technique) {
      return NextResponse.json(
        { error: 'Technique not found' },
        { status: 404 }
      );
    }

    // Upsert rating
    await prisma.userRating.upsert({
      where: {
        userId_techniqueId: {
          userId: user.id,
          techniqueId,
        },
      },
      update: {
        rating,
        notes: notes || null,
      },
      create: {
        userId: user.id,
        techniqueId,
        rating,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      message: 'Rating saved successfully',
      rating: { techniqueId, rating, notes },
    });
  } catch (error) {
    console.error('Save rating error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const ratings = await prisma.userRating.findMany({
      where: { userId: user.id },
      include: {
        technique: {
          select: {
            name: true,
            position: true,
            type: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
