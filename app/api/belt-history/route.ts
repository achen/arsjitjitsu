import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Valid belt values (kids + adults)
const VALID_BELTS = [
  // Kids belts
  'white-grey', 'grey', 'grey-white', 'grey-black',
  'yellow', 'yellow-white', 'yellow-black',
  'orange', 'orange-white', 'orange-black',
  'green', 'green-white', 'green-black',
  // Adult belts
  'white', 'blue', 'purple', 'brown', 'black',
  // Coral and red (master ranks)
  'coral', 'red-white', 'red'
];

// GET /api/belt-history - Get user's belt history
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const history = await prisma.beltHistory.findMany({
      where: { userId: user.id },
      orderBy: { achievedAt: 'asc' },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Get belt history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/belt-history - Add or update a belt promotion
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { belt, achievedAt } = body;

    if (!belt || !VALID_BELTS.includes(belt)) {
      return NextResponse.json(
        { error: 'Invalid belt' },
        { status: 400 }
      );
    }

    if (!achievedAt) {
      return NextResponse.json(
        { error: 'Achievement date is required' },
        { status: 400 }
      );
    }

    // Check if this belt already exists for the user
    const existing = await prisma.beltHistory.findFirst({
      where: {
        userId: user.id,
        belt: belt,
      },
    });

    let entry;
    if (existing) {
      // Update existing entry
      entry = await prisma.beltHistory.update({
        where: { id: existing.id },
        data: { achievedAt: new Date(achievedAt) },
      });
    } else {
      // Create new entry
      entry = await prisma.beltHistory.create({
        data: {
          userId: user.id,
          belt,
          achievedAt: new Date(achievedAt),
        },
      });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Save belt history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/belt-history - Remove a belt from history
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');

    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const entry = await prisma.beltHistory.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    await prisma.beltHistory.delete({
      where: { id: entryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete belt history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
