import { NextRequest, NextResponse } from 'next/server';
import db, { Technique, TechniqueWithRating } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const user = await getCurrentUser();
    
    let query = `
      SELECT 
        t.*,
        ${user ? 'ur.rating, ur.notes' : 'NULL as rating, NULL as notes'}
      FROM techniques t
    `;

    if (user) {
      query += ` LEFT JOIN user_ratings ur ON t.id = ur.technique_id AND ur.user_id = ?`;
    }

    const conditions: string[] = [];
    const params: (string | number)[] = user ? [user.id] : [];

    if (position) {
      conditions.push('t.position = ?');
      params.push(position);
    }

    if (type) {
      conditions.push('t.type = ?');
      params.push(type);
    }

    if (search) {
      conditions.push('(t.name LIKE ? OR t.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY t.position, t.type, t.name';

    const techniques = db.prepare(query).all(...params) as TechniqueWithRating[];

    return NextResponse.json({ techniques });
  } catch (error) {
    console.error('Get techniques error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
