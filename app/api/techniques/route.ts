import { NextRequest, NextResponse } from 'next/server';
import prisma, { TechniqueWithRating } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: any = {};

    if (position) {
      where.position = position;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const techniques = await prisma.technique.findMany({
      where,
      include: {
        ratings: user ? {
          where: { userId: user.id },
          select: { rating: true, notes: true, workingOn: true },
        } : false,
        // Include videos for all users
        videos: {
          select: { id: true, title: true, url: true, instructor: true, duration: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [
        { position: 'asc' },
        { type: 'asc' },
        { name: 'asc' },
      ],
    });

    const formattedTechniques = techniques.map(tech => ({
      id: tech.id,
      name: tech.name,
      position: tech.position,
      type: tech.type,
      description: tech.description,
      giType: tech.giType,
      createdAt: tech.createdAt,
      rating: tech.ratings?.[0]?.rating ?? null,
      notes: tech.ratings?.[0]?.notes ?? null,
      workingOn: tech.ratings?.[0]?.workingOn ?? false,
      videos: tech.videos || [],
    }));

    return NextResponse.json({ techniques: formattedTechniques });
  } catch (error) {
    console.error('Get techniques error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
