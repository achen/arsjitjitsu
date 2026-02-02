import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db, { User } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user
    const id = uuidv4();
    const passwordHash = await hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, name)
      VALUES (?, ?, ?, ?)
    `).run(id, email, passwordHash, name);

    // Create token
    const token = createToken({ userId: id, email });

    const response = NextResponse.json({
      user: { id, email, name, belt: 'white' },
      message: 'Registration successful',
    });

    response.cookies.set(setAuthCookie(token));

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
