import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

interface Video {
  title: string;
  youtubeUrl: string;
  positions: string[];
  techniqueTypes: string[];
  giNogi: string[];
  instructor: string;
  duration: string;
}

// Specific technique patterns to look for
const TECHNIQUE_PATTERNS = [
  // Chokes
  { pattern: /clock choke/i, name: 'Clock Choke', position: 'Turtle Top', type: 'Submission' },
  { pattern: /bread.?cutter/i, name: 'Bread Cutter Choke', position: 'Side Control Top', type: 'Submission' },
  { pattern: /kata.?ha.?jime/i, name: 'Kata Ha Jime', position: 'Back Control', type: 'Submission' },
  { pattern: /baseball.?bat/i, name: 'Baseball Bat Choke', position: 'Side Control Top', type: 'Submission' },
  { pattern: /step.?over choke/i, name: 'Step Over Choke', position: 'Side Control Top', type: 'Submission' },
  { pattern: /gi.?choke/i, name: 'Gi Choke', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /lapel choke/i, name: 'Lapel Choke', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /short choke/i, name: 'Short Choke', position: 'Back Control', type: 'Submission' },
  { pattern: /arm.?in guillotine/i, name: 'Arm-In Guillotine', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /high elbow guillotine/i, name: 'High Elbow Guillotine', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /ten finger/i, name: 'Ten Finger Guillotine', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /power guillotine/i, name: 'Power Guillotine', position: 'Standing', type: 'Submission' },
  { pattern: /marcelotine/i, name: 'Marcelotine', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /japanese.?necktie/i, name: 'Japanese Necktie', position: 'Turtle Top', type: 'Submission' },
  { pattern: /ninja choke/i, name: 'Ninja Choke', position: 'Half Guard Top', type: 'Submission' },
  { pattern: /no.?arm.?triangle/i, name: 'No-Arm Triangle', position: 'Mount Top', type: 'Submission' },
  { pattern: /mounted triangle/i, name: 'Mounted Triangle', position: 'Mount Top', type: 'Submission' },
  { pattern: /inverted triangle/i, name: 'Inverted Triangle', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /reverse triangle/i, name: 'Reverse Triangle', position: 'Side Control Top', type: 'Submission' },
  
  // Arm Attacks
  { pattern: /straight armbar/i, name: 'Straight Armbar', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /belly.?down armbar/i, name: 'Belly Down Armbar', position: 'Mount Top', type: 'Submission' },
  { pattern: /spinning armbar/i, name: 'Spinning Armbar', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /flying armbar/i, name: 'Flying Armbar', position: 'Standing', type: 'Submission' },
  { pattern: /bicep.?slicer/i, name: 'Bicep Slicer', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /shoulder lock/i, name: 'Shoulder Lock', position: 'Side Control Top', type: 'Submission' },
  { pattern: /arm crush/i, name: 'Arm Crush', position: 'Side Control Top', type: 'Submission' },
  { pattern: /baratoplata/i, name: 'Baratoplata', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /tarikoplata/i, name: 'Tarikoplata', position: 'Closed Guard Bottom', type: 'Submission' },
  { pattern: /monoplata/i, name: 'Monoplata', position: 'Side Control Top', type: 'Submission' },
  
  // Leg Locks
  { pattern: /outside heel hook/i, name: 'Outside Heel Hook', position: 'Outside Ashi', type: 'Submission' },
  { pattern: /inside heel hook/i, name: 'Inside Heel Hook', position: 'Saddle', type: 'Submission' },
  { pattern: /estima lock/i, name: 'Estima Lock', position: 'Standing', type: 'Submission' },
  { pattern: /aoki lock/i, name: 'Aoki Lock', position: 'Ashi Garami', type: 'Submission' },
  { pattern: /texas cloverleaf/i, name: 'Texas Cloverleaf', position: 'Ashi Garami', type: 'Submission' },
  { pattern: /electric chair/i, name: 'Electric Chair', position: 'Truck', type: 'Submission' },
  { pattern: /banana split/i, name: 'Banana Split', position: 'Truck', type: 'Submission' },
  { pattern: /calf.?crush/i, name: 'Calf Crush', position: 'Ashi Garami', type: 'Submission' },
  { pattern: /vaporizer/i, name: 'Vaporizer', position: 'Truck', type: 'Submission' },
  
  // Sweeps
  { pattern: /john wayne sweep/i, name: 'John Wayne Sweep', position: 'Half Guard Bottom', type: 'Sweep' },
  { pattern: /plan.?b sweep/i, name: 'Plan B Sweep', position: 'Half Guard Bottom', type: 'Sweep' },
  { pattern: /old school sweep/i, name: 'Old School Sweep', position: 'Half Guard Bottom', type: 'Sweep' },
  { pattern: /deep half sweep/i, name: 'Deep Half Sweep', position: 'Half Guard Bottom', type: 'Sweep' },
  { pattern: /electric sweep/i, name: 'Electric Sweep', position: 'Half Guard Bottom', type: 'Sweep' },
  { pattern: /shaolin sweep/i, name: 'Shaolin Sweep', position: 'De La Riva Guard', type: 'Sweep' },
  { pattern: /kiss.?of.?the.?dragon/i, name: 'Kiss of the Dragon', position: 'Reverse De La Riva', type: 'Sweep' },
  { pattern: /crab.?ride/i, name: 'Crab Ride', position: 'Turtle Bottom', type: 'Sweep' },
  { pattern: /matrix/i, name: 'Matrix', position: 'Single Leg X', type: 'Sweep' },
  { pattern: /baby.?bolo/i, name: 'Baby Bolo', position: 'De La Riva Guard', type: 'Sweep' },
  { pattern: /dummy sweep/i, name: 'Dummy Sweep', position: 'Closed Guard Bottom', type: 'Sweep' },
  { pattern: /star sweep/i, name: 'Star Sweep', position: 'Spider Guard', type: 'Sweep' },
  { pattern: /sit.?up sweep/i, name: 'Sit Up Sweep', position: 'Closed Guard Bottom', type: 'Sweep' },
  
  // Passes
  { pattern: /body.?lock pass/i, name: 'Body Lock Pass', position: 'Closed Guard Top', type: 'Pass' },
  { pattern: /float pass/i, name: 'Float Pass', position: 'Half Guard Top', type: 'Pass' },
  { pattern: /double.?under pass/i, name: 'Double Under Pass', position: 'Closed Guard Top', type: 'Pass' },
  { pattern: /folding pass/i, name: 'Folding Pass', position: 'Closed Guard Top', type: 'Pass' },
  { pattern: /sao.?paulo pass/i, name: 'Sao Paulo Pass', position: 'Closed Guard Top', type: 'Pass' },
  { pattern: /weave pass/i, name: 'Weave Pass', position: 'Half Guard Top', type: 'Pass' },
  { pattern: /windshield.?wiper/i, name: 'Windshield Wiper Pass', position: 'Half Guard Top', type: 'Pass' },
  { pattern: /rodeo pass/i, name: 'Rodeo Pass', position: 'De La Riva Guard', type: 'Pass' },
  { pattern: /corkscrew pass/i, name: 'Corkscrew Pass', position: 'Half Guard Top', type: 'Pass' },
  
  // Takedowns
  { pattern: /foot.?sweep/i, name: 'Foot Sweep', position: 'Standing', type: 'Takedown' },
  { pattern: /collar.?drag/i, name: 'Collar Drag', position: 'Standing', type: 'Takedown' },
  { pattern: /level.?change/i, name: 'Level Change', position: 'Standing', type: 'Takedown' },
  { pattern: /high.?crotch/i, name: 'High Crotch', position: 'Standing', type: 'Takedown' },
  { pattern: /low.?single/i, name: 'Low Single', position: 'Standing', type: 'Takedown' },
  { pattern: /blast.?double/i, name: 'Blast Double', position: 'Standing', type: 'Takedown' },
  { pattern: /power.?double/i, name: 'Power Double', position: 'Standing', type: 'Takedown' },
  { pattern: /body.?lock.?takedown/i, name: 'Body Lock Takedown', position: 'Standing', type: 'Takedown' },
  { pattern: /sumi.?gaeshi/i, name: 'Sumi Gaeshi', position: 'Standing', type: 'Takedown' },
  { pattern: /tomoe.?nage/i, name: 'Tomoe Nage', position: 'Standing', type: 'Takedown' },
  { pattern: /tani.?otoshi/i, name: 'Tani Otoshi', position: 'Standing', type: 'Takedown' },
  { pattern: /sacrifice.?throw/i, name: 'Sacrifice Throw', position: 'Standing', type: 'Takedown' },
  { pattern: /yoko.?wakare/i, name: 'Yoko Wakare', position: 'Standing', type: 'Takedown' },
  { pattern: /sasae/i, name: 'Sasae Tsurikomi Ashi', position: 'Standing', type: 'Takedown' },
  { pattern: /tai.?otoshi/i, name: 'Tai Otoshi', position: 'Standing', type: 'Takedown' },
  { pattern: /morote.?gari/i, name: 'Morote Gari', position: 'Standing', type: 'Takedown' },
  
  // Guards
  { pattern: /lapel.?guard/i, name: 'Lapel Guard', position: 'Closed Guard Bottom', type: 'Transition' },
  { pattern: /squid.?guard/i, name: 'Squid Guard', position: 'De La Riva Guard', type: 'Transition' },
  { pattern: /shin.?to.?shin/i, name: 'Shin to Shin Guard', position: 'Butterfly Guard', type: 'Transition' },
  { pattern: /sit.?up.?guard/i, name: 'Sit Up Guard', position: 'Butterfly Guard', type: 'Transition' },
  { pattern: /tornado.?guard/i, name: 'Tornado Guard', position: 'Half Guard Bottom', type: 'Transition' },
  { pattern: /deep.?half/i, name: 'Deep Half Guard', position: 'Half Guard Bottom', type: 'Transition' },
  { pattern: /quarter.?guard/i, name: 'Quarter Guard', position: 'Half Guard Bottom', type: 'Escape' },
  { pattern: /lockdown/i, name: 'Lockdown', position: 'Half Guard Bottom', type: 'Transition' },
  
  // Escapes & Defense
  { pattern: /running.?escape/i, name: 'Running Escape', position: 'Side Control Bottom', type: 'Escape' },
  { pattern: /ghost.?escape/i, name: 'Ghost Escape', position: 'Side Control Bottom', type: 'Escape' },
  { pattern: /frame.?escape/i, name: 'Frame Escape', position: 'Side Control Bottom', type: 'Escape' },
  { pattern: /late.?hip.?escape/i, name: 'Late Hip Escape', position: 'Side Control Bottom', type: 'Escape' },
  { pattern: /sit.?out/i, name: 'Sit Out', position: 'Turtle Bottom', type: 'Escape' },
  { pattern: /granby.?roll/i, name: 'Granby Roll', position: 'Turtle Bottom', type: 'Escape' },
  { pattern: /peterson.?roll/i, name: 'Peterson Roll', position: 'Turtle Bottom', type: 'Escape' },
  
  // Back Takes
  { pattern: /chair.?sit/i, name: 'Chair Sit', position: 'Turtle Top', type: 'Transition' },
  { pattern: /truck.?entry/i, name: 'Truck Entry', position: 'Turtle Top', type: 'Transition' },
  { pattern: /twister.?hook/i, name: 'Twister Hook', position: 'Truck', type: 'Transition' },
  
  // Control Positions
  { pattern: /gift.?wrap/i, name: 'Gift Wrap', position: 'Mount Top', type: 'Transition' },
  { pattern: /s.?mount/i, name: 'S-Mount', position: 'Mount Top', type: 'Transition' },
  { pattern: /high.?mount/i, name: 'High Mount', position: 'Mount Top', type: 'Transition' },
  { pattern: /technical.?mount/i, name: 'Technical Mount', position: 'Mount Top', type: 'Transition' },
  { pattern: /scarfhold/i, name: 'Scarf Hold', position: 'Kesa Gatame', type: 'Transition' },
  { pattern: /100.?kilos/i, name: 'Hundred Kilos', position: 'Side Control Top', type: 'Transition' },
  { pattern: /twister.?side/i, name: 'Twister Side Control', position: 'Side Control Top', type: 'Transition' },
];

async function main() {
  const dryRun = !process.argv.includes('--insert');
  
  const existingTechniques = await prisma.technique.findMany();
  const existingNames = new Set(existingTechniques.map(t => t.name.toLowerCase()));
  
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));
  
  const videos: Video[] = JSON.parse(fs.readFileSync('data/submissionsearcher-videos.json', 'utf-8'));
  const unmapped = videos.filter(v => !mappedUrls.has(v.youtubeUrl));
  
  console.log(`Analyzing ${unmapped.length} unmapped videos...`);
  console.log(dryRun ? 'DRY RUN MODE\n' : 'INSERTING DATA\n');
  
  const newTechniques: Map<string, { position: string; type: string; videos: Video[] }> = new Map();
  let matchedToExisting = 0;
  
  for (const video of unmapped) {
    for (const pattern of TECHNIQUE_PATTERNS) {
      if (pattern.pattern.test(video.title)) {
        // Check if technique already exists
        if (existingNames.has(pattern.name.toLowerCase())) {
          // Find the technique and map the video
          const technique = existingTechniques.find(t => 
            t.name.toLowerCase() === pattern.name.toLowerCase()
          );
          if (technique && !dryRun) {
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
              matchedToExisting++;
            } catch (e) {
              // Ignore duplicates
            }
          } else {
            matchedToExisting++;
          }
        } else {
          // New technique to create
          if (!newTechniques.has(pattern.name)) {
            newTechniques.set(pattern.name, {
              position: pattern.position,
              type: pattern.type,
              videos: []
            });
          }
          newTechniques.get(pattern.name)!.videos.push(video);
        }
        break; // Only match first pattern
      }
    }
  }
  
  // Sort by video count
  const sorted = [...newTechniques.entries()].sort((a, b) => b[1].videos.length - a[1].videos.length);
  
  console.log(`Matched ${matchedToExisting} videos to existing techniques`);
  console.log(`\nNew techniques to create (${sorted.length} total):\n`);
  
  let created = 0;
  let videosAdded = 0;
  
  for (const [name, data] of sorted) {
    console.log(`${name} (${data.position}, ${data.type}): ${data.videos.length} videos`);
    
    if (!dryRun && data.videos.length >= 2) {
      // Create the technique
      const technique = await prisma.technique.create({
        data: {
          name,
          position: data.position,
          type: data.type,
          giType: 'gi',
        }
      });
      created++;
      
      // Map all videos
      for (const video of data.videos) {
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
          videosAdded++;
        } catch (e) {
          // Ignore
        }
      }
    }
  }
  
  console.log(`\n--- Summary ---`);
  console.log(`Matched to existing: ${matchedToExisting}`);
  console.log(`New techniques: ${sorted.length}`);
  if (!dryRun) {
    console.log(`Actually created: ${created}`);
    console.log(`Videos added: ${videosAdded}`);
  } else {
    console.log(`\nRun with --insert to create techniques with 2+ videos`);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
