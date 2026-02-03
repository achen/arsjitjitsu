import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const belt = searchParams.get('belt');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    // Get total user count
    const totalUsers = await prisma.user.count();

    // Get total public users
    const totalPublicUsers = await prisma.user.count({
      where: { isPublic: true },
    });

    // Build where clause for leaderboard
    const whereClause: any = { isPublic: true };
    if (belt) {
      whereClause.belt = belt;
    }

    // Get users with their total scores
    const usersWithScores = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        belt: true,
        country: true,
        city: true,
        gym: true,
        createdAt: true,
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate scores and sort
    const leaderboard = usersWithScores
      .map(user => ({
        id: user.id,
        name: user.name,
        belt: user.belt,
        country: user.country,
        city: user.city,
        gym: user.gym,
        createdAt: user.createdAt,
        score: user.ratings.reduce((sum, r) => sum + r.rating, 0),
        techniquesRated: user.ratings.filter(r => r.rating > 0).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    // Get belt counts for filter buttons
    const beltCounts = await prisma.user.groupBy({
      by: ['belt'],
      where: { isPublic: true },
      _count: true,
    });

    const beltCountsMap = beltCounts.reduce((acc, item) => {
      acc[item.belt] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      leaderboard,
      totalUsers,
      totalPublicUsers,
      beltCounts: beltCountsMap,
      filteredBy: belt || null,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
