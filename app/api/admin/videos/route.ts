import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
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
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const videos = loadVideos();

  // Filter videos
  let filtered = videos;

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

  // Get unique values for filters
  const allPositions = [...new Set(videos.flatMap(v => v.positions))].sort();
  const allInstructors = [...new Set(videos.map(v => v.instructor))].sort();

  return NextResponse.json({
    videos: paged,
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
  });
}
