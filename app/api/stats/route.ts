import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { rateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from '@/lib/rateLimit';

interface StatsRow {
  position: string;
  type: string;
  total_count: number;
  rated_count: number;
  total_points: number;
  avg_rating: number;
}

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
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get total score and rated techniques
    const userRatings = await prisma.userRating.aggregate({
      where: { userId: user.id },
      _sum: { rating: true },
      _count: true,
    });

    // Get total techniques count
    const totalTechniques = await prisma.technique.count();

    // Get all techniques with their ratings for this user
    const techniques = await prisma.technique.findMany({
      include: {
        ratings: {
          where: { userId: user.id },
        },
      },
    });

    // Calculate stats by position
    const positionMap = new Map<string, StatsRow>();
    techniques.forEach(tech => {
      if (!positionMap.has(tech.position)) {
        positionMap.set(tech.position, {
          position: tech.position,
          type: '',
          total_count: 0,
          rated_count: 0,
          total_points: 0,
          avg_rating: 0,
        });
      }
      const stats = positionMap.get(tech.position)!;
      stats.total_count++;
      if (tech.ratings.length > 0) {
        stats.rated_count++;
        stats.total_points += tech.ratings[0].rating;
      }
    });

    const byPosition = Array.from(positionMap.values()).map(stats => ({
      ...stats,
      avg_rating: stats.rated_count > 0 ? Math.round((stats.total_points / stats.rated_count) * 100) / 100 : 0,
    })).sort((a, b) => a.position.localeCompare(b.position));

    // Calculate stats by type
    const typeMap = new Map<string, StatsRow>();
    techniques.forEach(tech => {
      if (!typeMap.has(tech.type)) {
        typeMap.set(tech.type, {
          position: '',
          type: tech.type,
          total_count: 0,
          rated_count: 0,
          total_points: 0,
          avg_rating: 0,
        });
      }
      const stats = typeMap.get(tech.type)!;
      stats.total_count++;
      if (tech.ratings.length > 0) {
        stats.rated_count++;
        stats.total_points += tech.ratings[0].rating;
      }
    });

    const byType = Array.from(typeMap.values()).map(stats => ({
      ...stats,
      avg_rating: stats.rated_count > 0 ? Math.round((stats.total_points / stats.rated_count) * 100) / 100 : 0,
    })).sort((a, b) => a.type.localeCompare(b.type));

    // Get recent activity
    const recentRatings = await prisma.userRating.findMany({
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
      take: 10,
    });

    return NextResponse.json({
      totalScore: userRatings._sum.rating || 0,
      ratedTechniques: userRatings._count,
      totalTechniques,
      byPosition,
      byType,
      recentRatings,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
