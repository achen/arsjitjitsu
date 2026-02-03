import { NextRequest, NextResponse } from 'next/server';
import prisma, { TechniqueWithRating } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

// Number of techniques to show as preview for unauthenticated users
const PREVIEW_LIMIT = 20;

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  
  // Rate limit unauthenticated requests
  if (!user) {
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, RATE_LIMITS.heavyRead);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please sign in or slow down.' },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }
  }

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

    // Get total count for unauthenticated users to show how many more exist
    const totalCount = !user ? await prisma.technique.count({ where }) : 0;

    const techniques = await prisma.technique.findMany({
      where,
      // Limit results for unauthenticated users to prevent scraping
      take: user ? undefined : PREVIEW_LIMIT,
      include: {
        ratings: user ? {
          where: { userId: user.id },
          select: { rating: true, notes: true, workingOn: true },
        } : false,
        // Don't include videos for unauthenticated users
        videos: user ? {
          select: { id: true, title: true, url: true, instructor: true, duration: true },
          orderBy: { createdAt: 'asc' },
        } : false,
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

    return NextResponse.json({ 
      techniques: formattedTechniques,
      // Include metadata for unauthenticated users
      ...(!user && {
        isPreview: true,
        previewCount: PREVIEW_LIMIT,
        totalCount,
      }),
    });
  } catch (error) {
    console.error('Get techniques error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
