import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Position mapping from video positions to our DB positions
const POSITION_MAP: Record<string, string> = {
  'mount': 'Mount Top',
  'mount top': 'Mount Top',
  'mount bottom': 'Mount Bottom',
  'side control': 'Side Control Top',
  'side control top': 'Side Control Top',
  'side control bottom': 'Side Control Bottom',
  'back': 'Back Control',
  'back control': 'Back Control',
  'back mount': 'Back Control',
  'rear mount': 'Back Control',
  'closed guard': 'Closed Guard Bottom',
  'guard': 'Closed Guard Bottom',
  'half guard': 'Half Guard Bottom',
  'half guard top': 'Half Guard Top',
  'half guard bottom': 'Half Guard Bottom',
  'butterfly guard': 'Butterfly Guard',
  'butterfly': 'Butterfly Guard',
  'de la riva': 'De La Riva Guard',
  'dlr': 'De La Riva Guard',
  'reverse de la riva': 'Reverse De La Riva',
  'rdlr': 'Reverse De La Riva',
  'spider guard': 'Spider Guard',
  'spider': 'Spider Guard',
  'lasso': 'Lasso Guard',
  'lasso guard': 'Lasso Guard',
  'x-guard': 'X-Guard',
  'x guard': 'X-Guard',
  'single leg x': 'Single Leg X',
  'slx': 'Single Leg X',
  '50/50': '50/50',
  'fifty fifty': '50/50',
  'knee shield': 'Knee Shield',
  'z-guard': 'Z-Guard',
  'z guard': 'Z-Guard',
  'standing': 'Standing',
  'turtle': 'Turtle Top',
  'turtle top': 'Turtle Top',
  'turtle bottom': 'Turtle Bottom',
  'north south': 'North-South Top',
  'north-south': 'North-South Top',
  'knee on belly': 'Knee on Belly Top',
  'kob': 'Knee on Belly Top',
  'crucifix': 'Crucifix',
  'truck': 'Truck',
  'ashi garami': 'Ashi Garami',
  'leg entanglement': 'Ashi Garami',
  'saddle': 'Saddle',
  'inside sankaku': 'Saddle',
  'outside ashi': 'Outside Ashi',
  'collar sleeve': 'Collar Sleeve Guard',
  'rubber guard': 'Rubber Guard',
  'worm guard': 'Worm Guard',
  'k guard': 'K Guard',
  'kesa gatame': 'Kesa Gatame',
};

// Type mapping
const TYPE_MAP: Record<string, string> = {
  'submission': 'Submission',
  'choke': 'Submission',
  'armlock': 'Submission',
  'leglock': 'Submission',
  'sweep': 'Sweep',
  'pass': 'Pass',
  'guard pass': 'Pass',
  'escape': 'Escape',
  'defense': 'Defense',
  'takedown': 'Takedown',
  'throw': 'Takedown',
  'transition': 'Transition',
  'entry': 'Entry',
  'setup': 'Setup',
};

interface Video {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  positions: string[];
  techniqueTypes: string[];
  giNogi: string[];
}

function extractTechniqueName(title: string): string {
  // Remove common patterns
  let name = title
    // Remove "by Author" patterns
    .replace(/\s*[-|:]\s*(?:by\s+)?[A-Z][a-z]+\s+[A-Z][a-z]+.*$/i, '')
    .replace(/\s+by\s+[A-Z][a-z]+\s+[A-Z][a-z]+.*$/i, '')
    // Remove common suffixes
    .replace(/\s*[-|:]\s*(?:bjj|jiu.?jitsu|tutorial|breakdown|instructional|how to|technique|guide|tips).*$/gi, '')
    .replace(/\s*\(.*?\)\s*/g, '') // Remove parentheses
    .replace(/\s*#\d+\s*/g, '') // Remove #numbers
    .replace(/\s*#\w+\s*$/g, '') // Remove hashtags
    .replace(/\s*[-|:]\s*(?:a |the |an ).*$/i, '') // Remove "- A detailed..." etc
    .replace(/\s*[-|:]\s*(?:learn|master|effective|ultimate|complete|comprehensive).*$/gi, '')
    // Remove HTML entities
    .replace(/&\w+;/g, '')
    .replace(/&#\d+;/g, '')
    // Clean up
    .replace(/\s+/g, ' ')
    .trim();
  
  // If name is too long, try to extract just the technique part
  if (name.length > 60) {
    // Look for common technique patterns
    const patterns = [
      /^(.+?)\s*[-:]/,  // Get text before first dash or colon
      /^(\w+\s+\w+\s+\w+)/, // First 3 words
    ];
    for (const pattern of patterns) {
      const match = name.match(pattern);
      if (match && match[1].length > 10 && match[1].length < 60) {
        name = match[1];
        break;
      }
    }
  }
  
  // Capitalize properly
  name = name.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  
  return name.substring(0, 80).trim();
}

function mapPosition(videoPositions: string[]): string | null {
  for (const pos of videoPositions) {
    const normalized = pos.toLowerCase().trim();
    if (POSITION_MAP[normalized]) {
      return POSITION_MAP[normalized];
    }
    // Try partial matches
    for (const [key, value] of Object.entries(POSITION_MAP)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return value;
      }
    }
  }
  return null;
}

function mapType(videoTypes: string[]): string {
  for (const type of videoTypes) {
    const normalized = type.toLowerCase().trim();
    if (TYPE_MAP[normalized]) {
      return TYPE_MAP[normalized];
    }
    for (const [key, value] of Object.entries(TYPE_MAP)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
  }
  return 'Submission'; // Default
}

function determineGiType(giNogi: string[]): 'gi' | 'nogi' {
  const hasGi = giNogi.some(g => g.toLowerCase().includes('gi') && !g.toLowerCase().includes('nogi'));
  const hasNogi = giNogi.some(g => g.toLowerCase().includes('nogi') || g.toLowerCase().includes('no-gi'));
  
  if (hasNogi && !hasGi) return 'nogi';
  return 'gi'; // Default to gi
}

async function main() {
  const dryRun = !process.argv.includes('--insert');
  
  // Get existing techniques and mapped videos
  const existingTechniques = await prisma.technique.findMany();
  const techniqueNames = new Set(existingTechniques.map(t => t.name.toLowerCase()));
  
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));
  
  // Load scraped videos
  const videos: Video[] = JSON.parse(fs.readFileSync('data/submissionsearcher-videos.json', 'utf-8'));
  const unmapped = videos.filter(v => !mappedUrls.has(v.youtubeUrl));
  
  console.log(`Total videos: ${videos.length}`);
  console.log(`Already mapped: ${mappedUrls.size}`);
  console.log(`Unmapped: ${unmapped.length}`);
  console.log(`Existing techniques: ${existingTechniques.length}`);
  console.log(`\n${dryRun ? 'DRY RUN - no changes will be made' : 'INSERTING DATA'}\n`);
  
  let created = 0;
  let mapped = 0;
  let skipped = 0;
  
  for (const video of unmapped) {
    const position = mapPosition(video.positions);
    if (!position) {
      skipped++;
      continue; // Skip videos without recognizable positions
    }
    
    const techniqueName = extractTechniqueName(video.title);
    const type = mapType(video.techniqueTypes);
    const giType = determineGiType(video.giNogi);
    
    // Check if technique already exists
    let technique = existingTechniques.find(t => 
      t.name.toLowerCase() === techniqueName.toLowerCase() && 
      t.position === position
    );
    
    if (!technique) {
      // Check if very similar name exists
      const similar = existingTechniques.find(t => 
        t.position === position &&
        (t.name.toLowerCase().includes(techniqueName.toLowerCase().substring(0, 20)) ||
         techniqueName.toLowerCase().includes(t.name.toLowerCase().substring(0, 20)))
      );
      
      if (similar) {
        technique = similar;
      }
    }
    
    if (!technique && !techniqueNames.has(techniqueName.toLowerCase())) {
      // Create new technique
      if (dryRun) {
        console.log(`Would create: "${techniqueName}" (${position}, ${type}, ${giType})`);
        console.log(`  -> Map video: ${video.title.substring(0, 60)}...`);
      } else {
        technique = await prisma.technique.create({
          data: {
            name: techniqueName,
            position,
            type,
            giType,
          }
        });
        existingTechniques.push(technique);
        techniqueNames.add(techniqueName.toLowerCase());
        console.log(`Created: "${techniqueName}" (${position})`);
      }
      created++;
    }
    
    if (technique || !dryRun) {
      // Map video to technique
      if (!dryRun && technique) {
        await prisma.techniqueVideo.create({
          data: {
            techniqueId: technique.id,
            title: video.title,
            url: video.youtubeUrl,
            instructor: video.instructor,
            duration: video.duration,
          }
        });
      }
      mapped++;
    }
  }
  
  console.log(`\n--- Summary ---`);
  console.log(`Techniques created: ${created}`);
  console.log(`Videos mapped: ${mapped}`);
  console.log(`Skipped (no position): ${skipped}`);
  
  if (dryRun) {
    console.log(`\nRun with --insert to apply changes`);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
