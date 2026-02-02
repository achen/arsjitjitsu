import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface StatsRow {
  position: string;
  type: string;
  total_count: number;
  rated_count: number;
  total_points: number;
  avg_rating: number;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get total score
    const scoreResult = db.prepare(`
      SELECT 
        COALESCE(SUM(rating), 0) as total_score,
        COUNT(*) as rated_techniques
      FROM user_ratings
      WHERE user_id = ?
    `).get(user.id) as { total_score: number; rated_techniques: number };

    // Get total techniques count
    const totalResult = db.prepare('SELECT COUNT(*) as count FROM techniques').get() as { count: number };

    // Get score breakdown by position
    const byPosition = db.prepare(`
      SELECT 
        t.position,
        COUNT(t.id) as total_count,
        COUNT(ur.id) as rated_count,
        COALESCE(SUM(ur.rating), 0) as total_points,
        ROUND(AVG(ur.rating), 2) as avg_rating
      FROM techniques t
      LEFT JOIN user_ratings ur ON t.id = ur.technique_id AND ur.user_id = ?
      GROUP BY t.position
      ORDER BY t.position
    `).all(user.id) as StatsRow[];

    // Get score breakdown by type
    const byType = db.prepare(`
      SELECT 
        t.type,
        COUNT(t.id) as total_count,
        COUNT(ur.id) as rated_count,
        COALESCE(SUM(ur.rating), 0) as total_points,
        ROUND(AVG(ur.rating), 2) as avg_rating
      FROM techniques t
      LEFT JOIN user_ratings ur ON t.id = ur.technique_id AND ur.user_id = ?
      GROUP BY t.type
      ORDER BY t.type
    `).all(user.id) as StatsRow[];

    // Get recent activity
    const recentRatings = db.prepare(`
      SELECT 
        ur.*,
        t.name as technique_name,
        t.position,
        t.type
      FROM user_ratings ur
      JOIN techniques t ON ur.technique_id = t.id
      WHERE ur.user_id = ?
      ORDER BY ur.updated_at DESC
      LIMIT 10
    `).all(user.id);

    return NextResponse.json({
      totalScore: scoreResult.total_score,
      ratedTechniques: scoreResult.rated_techniques,
      totalTechniques: totalResult.count,
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
