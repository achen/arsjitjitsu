import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
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
    const technique = db.prepare('SELECT id FROM techniques WHERE id = ?').get(techniqueId);
    if (!technique) {
      return NextResponse.json(
        { error: 'Technique not found' },
        { status: 404 }
      );
    }

    // Upsert rating
    const id = uuidv4();
    db.prepare(`
      INSERT INTO user_ratings (id, user_id, technique_id, rating, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id, technique_id) DO UPDATE SET
        rating = excluded.rating,
        notes = excluded.notes,
        updated_at = datetime('now')
    `).run(id, user.id, techniqueId, rating, notes || null);

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

    const ratings = db.prepare(`
      SELECT 
        ur.*,
        t.name as technique_name,
        t.position,
        t.type
      FROM user_ratings ur
      JOIN techniques t ON ur.technique_id = t.id
      WHERE ur.user_id = ?
      ORDER BY ur.updated_at DESC
    `).all(user.id);

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
