import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

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

// Position mapping from submissionsearcher positions to our positions
const POSITION_MAP: Record<string, string[]> = {
  'mount': ['Mount Top', 'Mount Bottom'],
  'high mount': ['Mount Top'],
  'side control': ['Side Control Top', 'Side Control Bottom'],
  'kesa gatame': ['Kesa Gatame', 'Kuzure Kesa Gatame'],
  'back control': ['Back Control', 'Back Defense'],
  'body triangle': ['Back Control'],
  'closed guard': ['Closed Guard Bottom', 'Closed Guard Top'],
  'half guard': ['Half Guard Top', 'Half Guard Bottom', 'Lockdown', 'Knee Shield', 'Z-Guard'],
  'deep half guard': ['Half Guard Bottom'],
  'de la riva guard': ['De La Riva Guard'],
  'reverse de la riva guard': ['Reverse De La Riva'],
  'spider guard': ['Spider Guard', 'Lasso Guard'],
  'x guard': ['X-Guard', 'Single Leg X'],
  'guard': ['Closed Guard Bottom', 'Butterfly Guard'],
  'open guard': ['Butterfly Guard', 'De La Riva Guard', 'Spider Guard', 'K Guard', 'Rubber Guard', 'Collar Sleeve Guard'],
  'leg entanglements': ['Ashi Garami', 'Saddle', '50/50', 'Outside Ashi', 'Backside 50/50', 'False Reap'],
  'ashi garami': ['Ashi Garami', 'Outside Ashi'],
  'honey hole': ['Saddle'],
  'inside sankaku': ['Saddle'],
  'knee on belly': ['Knee on Belly Top', 'Knee on Belly Bottom'],
  'north south': ['North-South Top', 'North-South Bottom'],
  'turtle': ['Turtle Top', 'Turtle Bottom'],
  'truck': ['Truck'],
  'standing takedown': ['Standing'],
  'scramble transition': ['Standing'],
  'front headlock': ['Turtle Top', 'Standing'],
  'collar tie': ['Standing'],
  'russian tie': ['Standing'],
  'double unders': ['Closed Guard Top', 'Half Guard Top'],
  'over under': ['Half Guard Top', 'Side Control Top'],
  'clock position': ['Turtle Top'],
  'spiral ride': ['Turtle Top'],
};

// Normalize text for comparison
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate similarity between two strings (simple word overlap)
function similarity(a: string, b: string): number {
  const wordsA = new Set(normalize(a).split(' '));
  const wordsB = new Set(normalize(b).split(' '));
  
  const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  
  return intersection / union;
}

// Check if video technique type matches technique name
function techniqueMatches(techniqueName: string, techniquePosition: string, videoTechniqueTypes: string[], videoTitle: string): number {
  const normName = normalize(techniqueName);
  const normTitle = normalize(videoTitle);
  const nameWords = normName.split(' ').filter(w => w.length > 2);
  
  // Skip generic names that match too broadly
  const genericNames = ['sweep', 'pass', 'escape', 'entry', 'control', 'transition', 'defense', 'attack', 'setup'];
  const isGenericName = genericNames.includes(normName) || nameWords.length === 0;
  
  if (isGenericName) {
    // For generic names, require position context in video
    const positionInTitle = videoTechniqueTypes.some(vt => 
      normalize(vt).includes(normalize(techniquePosition).split(' ')[0].toLowerCase())
    ) || normTitle.includes(normalize(techniquePosition).split(' ')[0].toLowerCase());
    if (!positionInTitle) return 0;
  }
  
  let bestScore = 0;
  
  // Check video title first (usually more accurate)
  if (normTitle.includes(normName)) {
    return 1.0;
  }
  
  // Check for specific technique patterns
  const keyMatches: Record<string, string[]> = {
    'armbar': ['arm bar', 'armbar', 'juji gatame'],
    'triangle': ['triangle choke', 'sankaku'],
    'triangle choke': ['triangle choke', 'sankaku jime'],
    'kimura': ['kimura'],
    'americana': ['americana', 'key lock', 'keylock'],
    'guillotine': ['guillotine'],
    'omoplata': ['omoplata'],
    'rear naked choke': ['rear naked', 'rnc', 'mata leao'],
    'bow and arrow choke': ['bow and arrow', 'bow arrow choke'],
    'ezekiel choke': ['ezekiel', 'sode guruma'],
    'knee slice pass': ['knee slice', 'knee cut pass'],
    'heel hook': ['heel hook'],
    'inside heel hook': ['inside heel hook'],
    'outside heel hook': ['outside heel hook'],
    'toe hold': ['toe hold'],
    'kneebar': ['kneebar', 'knee bar'],
    'ankle lock': ['ankle lock', 'straight ankle', 'straight foot lock'],
    'arm triangle': ['arm triangle', 'kata gatame', 'head and arm choke'],
    'north south choke': ['north south choke'],
    'darce choke': ['darce', 'd\'arce'],
    'anaconda choke': ['anaconda choke'],
    'baseball bat choke': ['baseball bat choke', 'baseball choke'],
    'loop choke': ['loop choke'],
    'cross collar choke': ['cross collar choke', 'cross choke'],
    'scissor sweep': ['scissor sweep'],
    'hip bump sweep': ['hip bump sweep', 'sit up sweep'],
    'flower sweep': ['flower sweep', 'pendulum sweep'],
    'double leg takedown': ['double leg takedown', 'double leg'],
    'single leg takedown': ['single leg takedown', 'single leg'],
    'arm drag': ['arm drag'],
    'back take': ['back take', 'take the back', 'taking the back'],
    'berimbolo': ['berimbolo'],
    'de la riva': ['de la riva', 'dlr guard'],
    'spider guard': ['spider guard'],
    'lasso guard': ['lasso guard', 'lasso'],
    'x guard': ['x guard', 'x-guard'],
    'single leg x': ['single leg x', 'slx'],
    'deep half': ['deep half guard'],
    'lockdown': ['lockdown'],
    'electric chair': ['electric chair'],
    'banana split': ['banana split'],
    'twister': ['twister'],
    'calf slicer': ['calf slicer', 'calf crush'],
    'gogoplata': ['gogoplata'],
    'truck': ['truck position', 'the truck'],
    'crucifix': ['crucifix'],
    'worm guard': ['worm guard'],
    'collar drag': ['collar drag'],
    'snap down': ['snap down'],
    'ouchi gari': ['ouchi gari', 'ouchi'],
    'kouchi gari': ['kouchi gari', 'kouchi'],
    'seoi nage': ['seoi nage'],
    'osoto gari': ['osoto gari'],
    'harai goshi': ['harai goshi'],
    'uchi mata': ['uchi mata'],
    'sumi gaeshi': ['sumi gaeshi'],
    'tomoe nage': ['tomoe nage'],
    'guard pull': ['guard pull'],
    'oil check': ['oil check'],
    'body triangle': ['body triangle'],
    'coyote guard': ['coyote'],
    '50 50': ['50 50', 'fifty fifty'],
    'ashi garami': ['ashi garami'],
    'saddle': ['saddle', 'honey hole', 'inside sankaku'],
    'rubber guard': ['rubber guard'],
    'k guard': ['k guard'],
    'z guard': ['z guard'],
    'knee shield': ['knee shield'],
    'underhook': ['underhook'],
    'overhook': ['overhook'],
    'whizzer': ['whizzer'],
  };
  
  // Try specific key matches first
  for (const [key, patterns] of Object.entries(keyMatches)) {
    if (normName === key || normName.includes(key)) {
      for (const pattern of patterns) {
        // Check in video title
        if (normTitle.includes(pattern)) {
          return 0.95;
        }
        // Check in technique types
        for (const vt of videoTechniqueTypes) {
          if (normalize(vt).includes(pattern)) {
            return 0.85;
          }
        }
      }
    }
  }
  
  // Check technique types
  for (const vt of videoTechniqueTypes) {
    const normVt = normalize(vt);
    
    // Exact match in technique type
    if (normVt.includes(normName) && normName.length > 5) {
      return 0.8;
    }
    
    // Word overlap for longer names
    if (nameWords.length >= 2) {
      const matchedWords = nameWords.filter(w => normVt.includes(w) || normTitle.includes(w));
      if (matchedWords.length >= 2) {
        const score = matchedWords.length / nameWords.length * 0.7;
        if (score > bestScore) bestScore = score;
      }
    }
  }
  
  return bestScore;
}

// Check if video position matches technique position
function positionMatches(techniquePosition: string, videoPositions: string[]): boolean {
  for (const vp of videoPositions) {
    const mapped = POSITION_MAP[vp];
    if (mapped && mapped.includes(techniquePosition)) {
      return true;
    }
  }
  return false;
}

async function main() {
  console.log('Loading scraped videos...');
  const videosPath = path.join(__dirname, '../data/submissionsearcher-videos.json');
  const videos: ScrapedVideo[] = JSON.parse(fs.readFileSync(videosPath, 'utf8'));
  console.log(`Loaded ${videos.length} videos`);

  console.log('\nLoading techniques from database...');
  const techniques = await prisma.technique.findMany({
    select: {
      id: true,
      name: true,
      position: true,
      type: true,
    }
  });
  console.log(`Loaded ${techniques.length} techniques`);

  // Check existing video count
  const existingCount = await prisma.techniqueVideo.count();
  console.log(`\nExisting videos in database: ${existingCount}`);

  // Map videos to techniques
  console.log('\nMapping videos to techniques...');
  
  const mappings: Array<{
    techniqueId: string;
    techniqueName: string;
    techniquePosition: string;
    video: ScrapedVideo;
    score: number;
  }> = [];

  let processed = 0;
  
  for (const video of videos) {
    if (!video.techniqueTypes || video.techniqueTypes.length === 0) continue;
    if (!video.positions || video.positions.length === 0) continue;
    
    for (const technique of techniques) {
      // Check position match first (faster filter)
      if (!positionMatches(technique.position, video.positions)) continue;
      
      // Check technique match
      const score = techniqueMatches(technique.name, technique.position, video.techniqueTypes, video.title);
      
      if (score >= 0.5) {
        mappings.push({
          techniqueId: technique.id,
          techniqueName: technique.name,
          techniquePosition: technique.position,
          video,
          score,
        });
      }
    }
    
    processed++;
    if (processed % 500 === 0) {
      console.log(`  Processed ${processed}/${videos.length} videos, found ${mappings.length} mappings`);
    }
  }

  console.log(`\nFound ${mappings.length} potential video-technique mappings`);

  // Sort by score and dedupe (keep top 5 per technique)
  mappings.sort((a, b) => b.score - a.score);
  
  const techniqueVideos: Map<string, typeof mappings> = new Map();
  for (const m of mappings) {
    const existing = techniqueVideos.get(m.techniqueId) || [];
    // Only keep top 5 per technique, and don't duplicate same video
    if (existing.length < 5 && !existing.some(e => e.video.youtubeId === m.video.youtubeId)) {
      existing.push(m);
      techniqueVideos.set(m.techniqueId, existing);
    }
  }

  // Count techniques with videos
  console.log(`\nTechniques with at least one video: ${techniqueVideos.size}/${techniques.length}`);

  // Preview some mappings
  console.log('\n--- Sample Mappings ---');
  let sampleCount = 0;
  for (const [techId, vids] of techniqueVideos) {
    if (sampleCount >= 10) break;
    const tech = techniques.find(t => t.id === techId);
    console.log(`\n${tech?.name} (${tech?.position}):`);
    for (const v of vids.slice(0, 2)) {
      console.log(`  [${v.score.toFixed(2)}] "${v.video.title}" by ${v.video.instructor}`);
      console.log(`         Types: ${v.video.techniqueTypes.slice(0, 3).join(', ')}`);
    }
    sampleCount++;
  }

  // Ask for confirmation
  const totalVideosToInsert = [...techniqueVideos.values()].reduce((sum, v) => sum + v.length, 0);
  console.log(`\n\nReady to insert ${totalVideosToInsert} video links for ${techniqueVideos.size} techniques.`);
  console.log('Run with --insert flag to actually insert into database.');
  console.log('Run with --clear flag to clear existing videos first.');

  if (process.argv.includes('--clear')) {
    console.log('\nClearing existing technique videos...');
    await prisma.techniqueVideo.deleteMany({});
    console.log('Cleared!');
  }

  if (process.argv.includes('--insert')) {
    console.log('\nInserting videos into database...');
    
    let inserted = 0;
    for (const [techniqueId, vids] of techniqueVideos) {
      for (const v of vids) {
        await prisma.techniqueVideo.create({
          data: {
            techniqueId,
            title: v.video.title,
            url: v.video.youtubeUrl,
            instructor: v.video.instructor,
            duration: v.video.duration,
          }
        });
        inserted++;
      }
      
      if (inserted % 100 === 0) {
        console.log(`  Inserted ${inserted} videos...`);
      }
    }
    
    console.log(`\nDone! Inserted ${inserted} video links.`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
