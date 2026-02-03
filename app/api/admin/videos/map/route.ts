import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  // Check admin
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { techniqueId, title, url, instructor, duration } = body;

    if (!techniqueId || !title || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: techniqueId, title, url' },
        { status: 400 }
      );
    }

    // Check if technique exists
    const technique = await prisma.technique.findUnique({
      where: { id: techniqueId },
    });

    if (!technique) {
      return NextResponse.json(
        { error: 'Technique not found' },
        { status: 404 }
      );
    }

    // Check if this video URL is already mapped to this technique
    const existing = await prisma.techniqueVideo.findFirst({
      where: {
        techniqueId,
        url,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This video is already mapped to this technique' },
        { status: 409 }
      );
    }

    // Create the mapping
    const video = await prisma.techniqueVideo.create({
      data: {
        techniqueId,
        title,
        url,
        instructor: instructor || null,
        duration: duration || null,
      },
    });

    return NextResponse.json({ video, technique });
  } catch (error) {
    console.error('Map video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Missing videoId parameter' },
        { status: 400 }
      );
    }

    await prisma.techniqueVideo.delete({
      where: { id: videoId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete video mapping error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
