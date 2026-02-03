import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get all rating history for this user, ordered by date
    const history = await prisma.ratingHistory.findMany({
      where: { userId: user.id },
      orderBy: { changedAt: 'asc' },
      select: {
        oldRating: true,
        newRating: true,
        changedAt: true,
      },
    });

    // Build score timeline
    // Each entry represents the cumulative score at that point in time
    let runningTotal = 0;
    const timeline: { date: string; score: number }[] = [];
    
    // Add initial point at account creation (score 0)
    timeline.push({
      date: user.createdAt.toISOString(),
      score: 0,
    });

    for (const entry of history) {
      const delta = entry.newRating - (entry.oldRating ?? 0);
      runningTotal += delta;
      timeline.push({
        date: entry.changedAt.toISOString(),
        score: runningTotal,
      });
    }

    // If the user has made changes today, use the last score
    // Otherwise, add current score as the latest point
    const currentScore = await prisma.userRating.aggregate({
      where: { userId: user.id },
      _sum: { rating: true },
    });

    const actualCurrentScore = currentScore._sum.rating ?? 0;
    
    // If timeline is empty or last point isn't today, add current state
    const now = new Date();
    const lastEntry = timeline[timeline.length - 1];
    if (!lastEntry || new Date(lastEntry.date).toDateString() !== now.toDateString()) {
      timeline.push({
        date: now.toISOString(),
        score: actualCurrentScore,
      });
    }

    return NextResponse.json({ timeline });
  } catch (error) {
    console.error('Get score history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
