import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/bookmarks - Get user's bookmarked video IDs
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await prisma.videoBookmark.findMany({
      where: { userId: user.id },
      select: { videoId: true },
    });

    return NextResponse.json({ 
      bookmarks: bookmarks.map(b => b.videoId) 
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return NextResponse.json({ error: 'Failed to get bookmarks' }, { status: 500 });
  }
}

// POST /api/bookmarks - Toggle bookmark for a video
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoId } = await request.json();
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    // Check if bookmark exists
    const existing = await prisma.videoBookmark.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId,
        },
      },
    });

    if (existing) {
      // Remove bookmark
      await prisma.videoBookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await prisma.videoBookmark.create({
        data: {
          userId: user.id,
          videoId,
        },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}
