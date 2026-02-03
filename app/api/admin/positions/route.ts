import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/positions - Get all positions
export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Get positions error:', error);
    return NextResponse.json({ error: 'Failed to get positions' }, { status: 500 });
  }
}

// POST /api/admin/positions - Create a new position
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, alternateNames } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if position already exists
    const existing = await prisma.position.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Position already exists' }, { status: 400 });
    }

    // Get max sortOrder
    const maxSort = await prisma.position.aggregate({
      _max: { sortOrder: true },
    });

    const position = await prisma.position.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        alternateNames: alternateNames || [],
        sortOrder: (maxSort._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ position });
  } catch (error) {
    console.error('Create position error:', error);
    return NextResponse.json({ error: 'Failed to create position' }, { status: 500 });
  }
}

// PUT /api/admin/positions - Update a position
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, alternateNames, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get the old position to check if name is changing
    const oldPosition = await prisma.position.findUnique({
      where: { id },
    });

    if (!oldPosition) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    const newName = name.trim();

    // If name is changing, check it doesn't conflict with another position
    if (oldPosition.name !== newName) {
      const existing = await prisma.position.findUnique({
        where: { name: newName },
      });

      if (existing) {
        return NextResponse.json({ error: 'A position with that name already exists' }, { status: 400 });
      }

      // Update all techniques that use the old position name
      await prisma.technique.updateMany({
        where: { position: oldPosition.name },
        data: { position: newName },
      });
    }

    const position = await prisma.position.update({
      where: { id },
      data: {
        name: newName,
        description: description?.trim() || null,
        alternateNames: alternateNames || [],
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({ position, oldName: oldPosition.name, newName });
  } catch (error) {
    console.error('Update position error:', error);
    return NextResponse.json({ error: 'Failed to update position' }, { status: 500 });
  }
}

// DELETE /api/admin/positions - Delete a position
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check if any techniques use this position
    const position = await prisma.position.findUnique({
      where: { id },
    });

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    const techniqueCount = await prisma.technique.count({
      where: { position: position.name },
    });

    if (techniqueCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete position with ${techniqueCount} techniques. Move or delete the techniques first.` 
      }, { status: 400 });
    }

    await prisma.position.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete position error:', error);
    return NextResponse.json({ error: 'Failed to delete position' }, { status: 500 });
  }
}
