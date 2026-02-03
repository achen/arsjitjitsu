import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Known technique keywords to look for in video titles
const TECHNIQUE_KEYWORDS: Record<string, string[]> = {
  // Submissions
  'Armbar': ['armbar', 'arm bar', 'juji gatame'],
  'Triangle Choke': ['triangle', 'sankaku'],
  'Rear Naked Choke': ['rear naked', 'rnc', 'mata leao'],
  'Guillotine': ['guillotine'],
  'Kimura': ['kimura'],
  'Americana': ['americana', 'keylock'],
  'Omoplata': ['omoplata'],
  'D\'Arce Choke': ['darce', 'd\'arce', 'brabo'],
  'Anaconda Choke': ['anaconda'],
  'Ezekiel Choke': ['ezekiel'],
  'Bow and Arrow Choke': ['bow and arrow', 'bow & arrow'],
  'Loop Choke': ['loop choke'],
  'Baseball Bat Choke': ['baseball bat', 'baseball choke'],
  'Cross Collar Choke': ['cross collar', 'cross choke'],
  'Paper Cutter Choke': ['paper cutter'],
  'Arm Triangle': ['arm triangle', 'head and arm', 'kata gatame'],
  'North South Choke': ['north south choke', 'north-south choke'],
  'Von Flue Choke': ['von flue'],
  'Heel Hook': ['heel hook'],
  'Toe Hold': ['toe hold'],
  'Knee Bar': ['kneebar', 'knee bar'],
  'Straight Ankle Lock': ['ankle lock', 'achilles lock'],
  'Calf Slicer': ['calf slicer', 'calf crush'],
  'Wrist Lock': ['wrist lock'],
  'Gogoplata': ['gogoplata'],
  'Twister': ['twister'],
  'Can Opener': ['can opener'],
  'Peruvian Necktie': ['peruvian necktie'],
  
  // Sweeps
  'Scissor Sweep': ['scissor sweep'],
  'Hip Bump Sweep': ['hip bump', 'sit up sweep'],
  'Flower Sweep': ['flower sweep', 'pendulum sweep'],
  'Elevator Sweep': ['elevator sweep'],
  'Butterfly Sweep': ['butterfly sweep'],
  'Hook Sweep': ['hook sweep'],
  'X-Guard Sweep': ['x-guard sweep', 'x guard sweep'],
  'Overhead Sweep': ['overhead sweep', 'balloon sweep'],
  'Berimbolo': ['berimbolo', 'bolo'],
  'Waiter Sweep': ['waiter sweep'],
  'Lumberjack Sweep': ['lumberjack sweep'],
  'Sickle Sweep': ['sickle sweep'],
  'Tripod Sweep': ['tripod sweep'],
  'Technical Stand Up': ['technical stand', 'tech stand'],
  
  // Passes
  'Knee Slice Pass': ['knee slice', 'knee cut', 'knee slide'],
  'Toreando Pass': ['toreando', 'bullfighter', 'torreada'],
  'Leg Drag Pass': ['leg drag'],
  'Over Under Pass': ['over under', 'over-under'],
  'Stack Pass': ['stack pass'],
  'Smash Pass': ['smash pass'],
  'Pressure Pass': ['pressure pass'],
  'X-Pass': ['x-pass', 'x pass'],
  'Long Step Pass': ['long step'],
  'Cartwheel Pass': ['cartwheel pass'],
  'Backstep Pass': ['backstep', 'back step'],
  'Headquarters': ['headquarters'],
  
  // Takedowns
  'Double Leg': ['double leg'],
  'Single Leg': ['single leg'],
  'Arm Drag': ['arm drag'],
  'Russian Tie': ['russian tie', '2 on 1', 'two on one'],
  'Collar Drag': ['collar drag'],
  'Duck Under': ['duck under'],
  'Snap Down': ['snapdown', 'snap down'],
  'Ankle Pick': ['ankle pick'],
  'Hip Throw': ['hip throw', 'o goshi', 'ogoshi'],
  'Fireman Carry': ['fireman', 'fireman\'s carry'],
  'Foot Sweep': ['foot sweep', 'de ashi', 'deashi'],
  'Seoi Nage': ['seoi nage', 'shoulder throw'],
  'Uchi Mata': ['uchi mata'],
  'Harai Goshi': ['harai goshi'],
  'Osoto Gari': ['osoto gari', 'osoto'],
  'Ouchi Gari': ['ouchi gari', 'ouchi'],
  'Kouchi Gari': ['kouchi gari', 'kouchi'],
  'Kata Guruma': ['kata guruma'],
  'Suplex': ['suplex'],
  'Lateral Drop': ['lateral drop'],
  'Cement Mixer': ['cement mixer'],
  'Peterson Roll': ['peterson'],
  'Granby Roll': ['granby'],
  'Whizzer': ['whizzer'],
  'Body Lock Takedown': ['body lock takedown', 'bodylock takedown'],
  'Inside Trip': ['inside trip'],
  'Outside Trip': ['outside trip'],
  'Slide By': ['slide by', 'slide-by', 'slideby'],
  
  // Escapes
  'Bridge and Roll': ['bridge and roll', 'upa', 'trap and roll'],
  'Elbow Escape': ['elbow escape', 'elbow knee escape', 'shrimp'],
  'Hip Escape': ['hip escape', 'shrimping'],
  'Back Escape': ['back escape'],
  'Side Control Escape': ['side control escape'],
  'Mount Escape': ['mount escape'],
  'Turtle Escape': ['turtle escape'],
  
  // Guards
  'Closed Guard': ['closed guard'],
  'Half Guard': ['half guard'],
  'Butterfly Guard': ['butterfly guard'],
  'De La Riva': ['de la riva', 'dlr'],
  'Reverse De La Riva': ['reverse de la riva', 'rdlr'],
  'Spider Guard': ['spider guard'],
  'Lasso Guard': ['lasso guard', 'lasso'],
  'X-Guard': ['x-guard', 'x guard'],
  'Single Leg X': ['single leg x', 'slx', 'ashi garami'],
  'Rubber Guard': ['rubber guard', 'mission control', 'zombie'],
  '50/50': ['50/50', 'fifty fifty', '50-50'],
  'Worm Guard': ['worm guard'],
  'K Guard': ['k guard', 'k-guard'],
  'Collar Sleeve': ['collar sleeve'],
  'Knee Shield': ['knee shield', 'z-guard', 'z guard'],
  
  // Positions/Controls
  'Mount': ['mount'],
  'Side Control': ['side control'],
  'Back Control': ['back control', 'back mount', 'back take'],
  'Turtle': ['turtle'],
  'North South': ['north south', 'north-south'],
  'Knee on Belly': ['knee on belly', 'kob'],
  'Crucifix': ['crucifix'],
  'Truck': ['truck'],
  'Saddle': ['saddle', 'inside sankaku', 'honeyhole'],
};

interface Video {
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  instructor: string;
  duration: string;
  positions: string[];
  techniqueTypes: string[];
  giNogi: string[];
}

interface Technique {
  id: string;
  name: string;
  position: string;
  type: string;
}

function findMatchingTechnique(videoTitle: string, techniques: Technique[]): Technique | null {
  const titleLower = videoTitle.toLowerCase();
  
  // First try exact technique name matches
  for (const technique of techniques) {
    const techNameLower = technique.name.toLowerCase();
    if (titleLower.includes(techNameLower) && techNameLower.length > 5) {
      return technique;
    }
  }
  
  // Then try keyword matches
  for (const [techniqueName, keywords] of Object.entries(TECHNIQUE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (titleLower.includes(keyword)) {
        // Find a technique with this name
        const match = techniques.find(t => 
          t.name.toLowerCase().includes(techniqueName.toLowerCase()) ||
          techniqueName.toLowerCase().includes(t.name.toLowerCase())
        );
        if (match) return match;
      }
    }
  }
  
  return null;
}

async function main() {
  const dryRun = !process.argv.includes('--insert');
  
  // Get existing techniques and mapped videos
  const techniques = await prisma.technique.findMany();
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));
  
  // Load scraped videos
  const videos: Video[] = JSON.parse(fs.readFileSync('data/submissionsearcher-videos.json', 'utf-8'));
  const unmapped = videos.filter(v => !mappedUrls.has(v.youtubeUrl));
  
  console.log(`Total videos: ${videos.length}`);
  console.log(`Already mapped: ${mappedUrls.size}`);
  console.log(`Unmapped: ${unmapped.length}`);
  console.log(`Existing techniques: ${techniques.length}`);
  console.log(`\n${dryRun ? 'DRY RUN - no changes will be made' : 'INSERTING DATA'}\n`);
  
  let matched = 0;
  let noMatch = 0;
  const matchedByTechnique: Record<string, number> = {};
  
  for (const video of unmapped) {
    const technique = findMatchingTechnique(video.title, techniques);
    
    if (technique) {
      matched++;
      matchedByTechnique[technique.name] = (matchedByTechnique[technique.name] || 0) + 1;
      
      if (!dryRun) {
        try {
          await prisma.techniqueVideo.create({
            data: {
              techniqueId: technique.id,
              title: video.title,
              url: video.youtubeUrl,
              instructor: video.instructor,
              duration: video.duration,
            }
          });
        } catch (e) {
          // Ignore duplicates
        }
      }
    } else {
      noMatch++;
    }
  }
  
  console.log(`\n--- Summary ---`);
  console.log(`Matched to existing techniques: ${matched}`);
  console.log(`No match found: ${noMatch}`);
  
  // Show top matched techniques
  const sorted = Object.entries(matchedByTechnique)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);
  
  console.log(`\nTop techniques matched:`);
  for (const [name, count] of sorted) {
    console.log(`  ${name}: ${count} videos`);
  }
  
  if (dryRun) {
    console.log(`\nRun with --insert to apply changes`);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
