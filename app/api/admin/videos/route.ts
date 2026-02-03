import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';
import * as fs from 'fs';
import * as path from 'path';

interface ScrapedVideo {
  id: number;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  giNogi: string[];
  positions: string[];
  techniqueTypes: string[];
}

let cachedVideos: ScrapedVideo[] | null = null;

function loadVideos(): ScrapedVideo[] {
  if (cachedVideos) return cachedVideos;
  
  const videosPath = path.join(process.cwd(), 'data', 'submissionsearcher-videos.json');
  cachedVideos = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
  return cachedVideos!;
}

export async function GET(request: NextRequest) {
  // Check admin
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const position = searchParams.get('position') || '';
  const instructor = searchParams.get('instructor') || '';
  const mappedFilter = searchParams.get('mapped') || 'unmapped'; // 'all', 'mapped', 'unmapped'
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const videos = loadVideos();

  // Get all mapped video URLs from the database
  const mappedVideos = await prisma.techniqueVideo.findMany({
    select: { url: true },
  });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));

  // Filter videos
  let filtered = videos;

  // Filter by mapped status
  if (mappedFilter === 'unmapped') {
    filtered = filtered.filter(v => !mappedUrls.has(v.youtubeUrl));
  } else if (mappedFilter === 'mapped') {
    filtered = filtered.filter(v => mappedUrls.has(v.youtubeUrl));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(searchLower) ||
      v.techniqueTypes.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  if (position) {
    const posLower = position.toLowerCase();
    filtered = filtered.filter(v => 
      v.positions.some(p => p.toLowerCase().includes(posLower))
    );
  }

  if (instructor) {
    const instLower = instructor.toLowerCase();
    filtered = filtered.filter(v => 
      v.instructor.toLowerCase().includes(instLower)
    );
  }

  // Paginate
  const total = filtered.length;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  // Add isMapped flag to each video
  const pagedWithMapped = paged.map(v => ({
    ...v,
    isMapped: mappedUrls.has(v.youtubeUrl),
  }));

  // Get unique values for filters
  const allPositions = [...new Set(videos.flatMap(v => v.positions))].sort();
  const allInstructors = [...new Set(videos.map(v => v.instructor))].sort();

  // Count mapped/unmapped
  const mappedCount = videos.filter(v => mappedUrls.has(v.youtubeUrl)).length;
  const unmappedCount = videos.length - mappedCount;

  return NextResponse.json({
    videos: pagedWithMapped,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    filters: {
      positions: allPositions,
      instructors: allInstructors.slice(0, 100), // Limit to top 100
    },
    stats: {
      total: videos.length,
      mapped: mappedCount,
      unmapped: unmappedCount,
    },
  });
}
