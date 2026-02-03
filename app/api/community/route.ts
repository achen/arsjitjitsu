import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Age range definitions (in years)
const AGE_RANGES = {
  'juvenile': { min: 0, max: 17 },
  'adult': { min: 18, max: 29 },
  'master1': { min: 30, max: 35 },
  'master2': { min: 36, max: 40 },
  'master3': { min: 41, max: 45 },
  'master4': { min: 46, max: 50 },
  'master5': { min: 51, max: 55 },
  'master6': { min: 56, max: 60 },
  'master7': { min: 61, max: 200 },
} as const;

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// GET /api/community - Get community comparison data with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const belt = searchParams.get('belt');
    const ageRange = searchParams.get('ageRange') as keyof typeof AGE_RANGES | null;
    const weight = searchParams.get('weight');

    // Build where clause for filtering
    const whereClause: any = { isPublic: true };
    if (belt) {
      whereClause.belt = belt;
    }
    if (weight) {
      whereClause.weight = weight;
    }

    // Get all matching users with their scores
    const matchingUsers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        belt: true,
        birthDate: true,
        weight: true,
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Filter by age range if specified
    let filteredUsers = matchingUsers;
    if (ageRange && AGE_RANGES[ageRange]) {
      const range = AGE_RANGES[ageRange];
      filteredUsers = matchingUsers.filter(user => {
        if (!user.birthDate) return false;
        const age = calculateAge(user.birthDate);
        return age >= range.min && age <= range.max;
      });
    }

    // Calculate stats for each user
    const usersWithStats = filteredUsers.map(user => ({
      id: user.id,
      name: user.name,
      belt: user.belt,
      points: user.ratings.reduce((sum, r) => sum + r.rating, 0),
      techniquesRated: user.ratings.filter(r => r.rating > 0).length,
    }));

    // Calculate averages
    const totalPoints = usersWithStats.reduce((sum, u) => sum + u.points, 0);
    const totalTechniquesRated = usersWithStats.reduce((sum, u) => sum + u.techniquesRated, 0);
    const count = usersWithStats.length;

    const averages = {
      points: count > 0 ? Math.round(totalPoints / count) : 0,
      techniquesRated: count > 0 ? Math.round(totalTechniquesRated / count) : 0,
    };

    // Calculate percentile distributions
    const pointsSorted = usersWithStats.map(u => u.points).sort((a, b) => a - b);
    const techniquesRatedSorted = usersWithStats.map(u => u.techniquesRated).sort((a, b) => a - b);

    const getPercentile = (arr: number[], percentile: number) => {
      if (arr.length === 0) return 0;
      const index = Math.ceil((percentile / 100) * arr.length) - 1;
      return arr[Math.max(0, index)];
    };

    const percentiles = {
      points: {
        p25: getPercentile(pointsSorted, 25),
        p50: getPercentile(pointsSorted, 50),
        p75: getPercentile(pointsSorted, 75),
        p90: getPercentile(pointsSorted, 90),
      },
      techniquesRated: {
        p25: getPercentile(techniquesRatedSorted, 25),
        p50: getPercentile(techniquesRatedSorted, 50),
        p75: getPercentile(techniquesRatedSorted, 75),
        p90: getPercentile(techniquesRatedSorted, 90),
      },
    };

    // Get belt counts for filter options (all public users)
    const beltCounts = await prisma.user.groupBy({
      by: ['belt'],
      where: { isPublic: true },
      _count: true,
    });

    // Get weight counts for filter options
    const weightCounts = await prisma.user.groupBy({
      by: ['weight'],
      where: { isPublic: true, weight: { not: null } },
      _count: true,
    });

    return NextResponse.json({
      matchingCount: count,
      averages,
      percentiles,
      filters: {
        belt: belt || null,
        ageRange: ageRange || null,
        weight: weight || null,
      },
      beltCounts: beltCounts.reduce((acc, item) => {
        acc[item.belt] = item._count;
        return acc;
      }, {} as Record<string, number>),
      weightCounts: weightCounts.reduce((acc, item) => {
        if (item.weight) acc[item.weight] = item._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('Get community error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
