import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/notes?techniqueId=xxx - Get all notes for a technique
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const techniqueId = searchParams.get('techniqueId');

    if (!techniqueId) {
      return NextResponse.json({ error: 'techniqueId required' }, { status: 400 });
    }

    const notes = await prisma.techniqueNote.findMany({
      where: {
        userId: user.id,
        techniqueId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST /api/notes - Add a new note to a technique
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { techniqueId, content } = body;

    if (!techniqueId || !content || content.trim() === '') {
      return NextResponse.json({ error: 'techniqueId and content required' }, { status: 400 });
    }

    // Verify technique exists
    const technique = await prisma.technique.findUnique({
      where: { id: techniqueId },
    });

    if (!technique) {
      return NextResponse.json({ error: 'Technique not found' }, { status: 404 });
    }

    const note = await prisma.techniqueNote.create({
      data: {
        userId: user.id,
        techniqueId,
        content: content.trim(),
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

// DELETE /api/notes - Delete a note
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json({ error: 'noteId required' }, { status: 400 });
    }

    // Verify note belongs to user
    const note = await prisma.techniqueNote.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    if (note.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.techniqueNote.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
