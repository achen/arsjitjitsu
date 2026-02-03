/**
 * Fetches all BJJ technique videos from submissionsearcher.com's public WordPress REST API
 * Saves the data to a JSON file for later mapping to our technique database
 */

import * as fs from 'fs';
import * as path from 'path';

const API_BASE = 'https://submissionsearcher.com/wp-json/wp/v2/techniques';
const PER_PAGE = 100; // Max allowed by WordPress REST API
const OUTPUT_FILE = path.join(__dirname, '../data/submissionsearcher-videos.json');

interface WordPressTechnique {
  id: number;
  title: { rendered: string };
  acf: {
    youtube_video: string;
    youtube_id: string;
    youtube_video_thumbnail: string;
    youtube_channel_name: string;
    duration: string;
    video_length: string;
    view_count: number;
    like_count: number;
  };
  'gi_or_nogi': number[];
  'technique-type': number[];
  position: number[];
  class_list: string[];
}

interface ExtractedVideo {
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

// Parse class_list to extract readable category names
function parseClassList(classList: string[]): { giNogi: string[]; positions: string[]; techniqueTypes: string[] } {
  const giNogi: string[] = [];
  const positions: string[] = [];
  const techniqueTypes: string[] = [];

  for (const cls of classList) {
    // gi_or_nogi-gi, gi_or_nogi-no-gi
    if (cls.startsWith('gi_or_nogi-')) {
      const value = cls.replace('gi_or_nogi-', '');
      if (value === 'gi') giNogi.push('Gi');
      else if (value === 'no-gi') giNogi.push('No-Gi');
      else if (value === 'mma') giNogi.push('MMA');
    }
    // position-xxx
    else if (cls.startsWith('position-')) {
      const value = cls.replace('position-', '').replace(/-/g, ' ');
      positions.push(value);
    }
    // technique-type-xxx
    else if (cls.startsWith('technique-type-')) {
      const value = cls.replace('technique-type-', '').replace(/-/g, ' ');
      techniqueTypes.push(value);
    }
  }

  return { giNogi, positions, techniqueTypes };
}

async function fetchPage(page: number): Promise<WordPressTechnique[]> {
  const url = `${API_BASE}?page=${page}&per_page=${PER_PAGE}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 400) {
      // No more pages
      return [];
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchAllTechniques(): Promise<ExtractedVideo[]> {
  const allVideos: ExtractedVideo[] = [];
  let page = 1;
  let hasMore = true;

  console.log('Starting to fetch techniques from submissionsearcher.com...\n');

  while (hasMore) {
    process.stdout.write(`Fetching page ${page}...`);
    
    try {
      const techniques = await fetchPage(page);
      
      if (techniques.length === 0) {
        hasMore = false;
        console.log(' No more data.');
        break;
      }

      for (const tech of techniques) {
        if (!tech.acf?.youtube_id) continue; // Skip if no YouTube video

        const { giNogi, positions, techniqueTypes } = parseClassList(tech.class_list || []);

        allVideos.push({
          id: tech.id,
          title: tech.title.rendered
            .replace(/&#8217;/g, "'")
            .replace(/&#8211;/g, "-")
            .replace(/&#8220;/g, '"')
            .replace(/&#8221;/g, '"')
            .replace(/&amp;/g, '&'),
          youtubeId: tech.acf.youtube_id,
          youtubeUrl: tech.acf.youtube_video,
          thumbnail: tech.acf.youtube_video_thumbnail,
          instructor: tech.acf.youtube_channel_name || 'Unknown',
          duration: tech.acf.duration || tech.acf.video_length,
          viewCount: tech.acf.view_count || 0,
          likeCount: tech.acf.like_count || 0,
          giNogi,
          positions,
          techniqueTypes,
        });
      }

      console.log(` Got ${techniques.length} techniques. Total: ${allVideos.length}`);
      
      page++;
      
      // Rate limiting - be nice to their server
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(` Error: ${error}`);
      hasMore = false;
    }
  }

  return allVideos;
}

async function main() {
  try {
    const videos = await fetchAllTechniques();
    
    console.log(`\n✅ Fetched ${videos.length} videos total`);

    // Create data directory if it doesn't exist
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(videos, null, 2));
    console.log(`📁 Saved to ${OUTPUT_FILE}`);

    // Print some stats
    const instructors = new Map<string, number>();
    const positionCounts = new Map<string, number>();
    
    for (const video of videos) {
      instructors.set(video.instructor, (instructors.get(video.instructor) || 0) + 1);
      for (const pos of video.positions) {
        positionCounts.set(pos, (positionCounts.get(pos) || 0) + 1);
      }
    }

    console.log('\n📊 Top 20 Instructors:');
    const topInstructors = [...instructors.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    for (const [name, count] of topInstructors) {
      console.log(`  ${name}: ${count} videos`);
    }

    console.log('\n📍 Top 20 Positions:');
    const topPositions = [...positionCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    for (const [name, count] of topPositions) {
      console.log(`  ${name}: ${count} videos`);
    }

    // Count gi/nogi
    let giCount = 0, nogiCount = 0;
    for (const video of videos) {
      if (video.giNogi.includes('Gi')) giCount++;
      if (video.giNogi.includes('No-Gi')) nogiCount++;
    }
    console.log(`\n🥋 Gi: ${giCount} | No-Gi: ${nogiCount}`);

  } catch (error) {
    console.error('Failed to fetch techniques:', error);
    process.exit(1);
  }
}

main();
