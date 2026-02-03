import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

// Create a new technique (admin only)
export async function POST(request: NextRequest) {
  // Check admin
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, position, type, description, giType } = body;

    if (!name || !position || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, position, type' },
        { status: 400 }
      );
    }

    // Check if technique already exists with same name and position
    const existing = await prisma.technique.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        position,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Technique "${name}" already exists in position "${position}"` },
        { status: 409 }
      );
    }

    // Create the technique
    const technique = await prisma.technique.create({
      data: {
        name,
        position,
        type,
        description: description || null,
        giType: giType || 'both',
      },
    });

    return NextResponse.json({ technique });
  } catch (error) {
    console.error('Create technique error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a technique (admin only)
export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, position, type, description, giType } = body;

    if (!id) {
      return NextResponse.json({ error: 'Technique ID required' }, { status: 400 });
    }

    if (!name || !position || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, position, type' },
        { status: 400 }
      );
    }

    const technique = await prisma.technique.update({
      where: { id },
      data: {
        name,
        position,
        type,
        description: description || null,
        giType: giType || 'both',
      },
    });

    return NextResponse.json({ technique });
  } catch (error) {
    console.error('Update technique error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete a technique (admin only)
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Technique ID required' }, { status: 400 });
    }

    await prisma.technique.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete technique error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
