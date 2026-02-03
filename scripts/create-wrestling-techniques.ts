import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// More wrestling techniques
const wrestlingTechniques: Array<{
  name: string;
  keywords: string[];
  type: string;
  giType: "BOTH" | "GI" | "NOGI";
}> = [
  // Suplexes
  { name: "Suplex", keywords: ["suplex"], type: "Takedown", giType: "BOTH" },
  { name: "German Suplex", keywords: ["german suplex"], type: "Takedown", giType: "BOTH" },
  { name: "Belly to Back Suplex", keywords: ["belly to back", "back suplex"], type: "Takedown", giType: "BOTH" },
  { name: "Belly to Belly Suplex", keywords: ["belly to belly"], type: "Takedown", giType: "BOTH" },
  { name: "Salto", keywords: ["salto"], type: "Takedown", giType: "BOTH" },
  
  // Single leg variations
  { name: "Single Leg Takedown", keywords: ["single leg"], type: "Takedown", giType: "BOTH" },
  { name: "Running the Pipe", keywords: ["running the pipe", "run the pipe"], type: "Takedown", giType: "BOTH" },
  { name: "Tree Top Single", keywords: ["tree top"], type: "Takedown", giType: "BOTH" },
  { name: "Limp Leg", keywords: ["limp leg"], type: "Defense", giType: "BOTH" },
  
  // Double leg variations  
  { name: "Double Leg Takedown", keywords: ["double leg"], type: "Takedown", giType: "BOTH" },
  { name: "Blast Double", keywords: ["blast double"], type: "Takedown", giType: "BOTH" },
  { name: "Snatch Double", keywords: ["snatch double"], type: "Takedown", giType: "BOTH" },
  
  // Throws and trips
  { name: "Headlock Throw", keywords: ["headlock throw"], type: "Takedown", giType: "BOTH" },
  { name: "Arm Throw", keywords: ["arm throw"], type: "Takedown", giType: "BOTH" },
  { name: "Foot Sweep", keywords: ["foot sweep"], type: "Takedown", giType: "BOTH" },
  { name: "Leg Trip", keywords: ["leg trip"], type: "Takedown", giType: "BOTH" },
  { name: "Inside Trip", keywords: ["inside trip"], type: "Takedown", giType: "BOTH" },
  { name: "Outside Trip", keywords: ["outside trip"], type: "Takedown", giType: "BOTH" },
  { name: "Leg Sweep", keywords: ["leg sweep"], type: "Takedown", giType: "BOTH" },
  
  // Mat returns / ground work
  { name: "Mat Return", keywords: ["mat return"], type: "Takedown", giType: "BOTH" },
  { name: "Gut Wrench", keywords: ["gut wrench", "gutwrench"], type: "Control", giType: "BOTH" },
  { name: "Leg Lace", keywords: ["leg lace"], type: "Control", giType: "BOTH" },
  { name: "Leg Ride", keywords: ["leg ride", "leg riding"], type: "Control", giType: "BOTH" },
  { name: "Cradle", keywords: ["cradle"], type: "Control", giType: "BOTH" },
  { name: "Cross Face", keywords: ["cross face", "crossface"], type: "Control", giType: "BOTH" },
  { name: "Cheap Tilt", keywords: ["cheap tilt"], type: "Control", giType: "BOTH" },
  { name: "Turk", keywords: ["turk"], type: "Control", giType: "BOTH" },
  { name: "Wrist Ride", keywords: ["wrist ride"], type: "Control", giType: "BOTH" },
  { name: "Navy Ride", keywords: ["navy ride"], type: "Control", giType: "BOTH" },
  { name: "Tight Waist", keywords: ["tight waist"], type: "Control", giType: "BOTH" },
  { name: "Head Outside Single", keywords: ["head outside single", "head outside"], type: "Takedown", giType: "BOTH" },
  { name: "Head Inside Single", keywords: ["head inside single", "head inside"], type: "Takedown", giType: "BOTH" },
  
  // Setups and chains
  { name: "Fake Shot", keywords: ["fake shot", "fake single", "fake double"], type: "Setup", giType: "BOTH" },
  { name: "Chain Wrestling", keywords: ["chain wrestling"], type: "Transition", giType: "BOTH" },
  { name: "Re-shot", keywords: ["re-shot", "reshot"], type: "Takedown", giType: "BOTH" },
  { name: "Clearing Ties", keywords: ["clearing ties", "clear ties"], type: "Defense", giType: "BOTH" },
  
  // Defense
  { name: "Takedown Defense", keywords: ["takedown defense", "takedown defence", "td defense", "sprawl and brawl"], type: "Defense", giType: "BOTH" },
  { name: "Single Leg Defense", keywords: ["single leg defense", "single leg defence"], type: "Defense", giType: "BOTH" },
  { name: "Double Leg Defense", keywords: ["double leg defense", "double leg defence"], type: "Defense", giType: "BOTH" },
  { name: "Sprawl", keywords: ["sprawl"], type: "Defense", giType: "BOTH" },
  { name: "Crossface Defense", keywords: ["crossface defense"], type: "Defense", giType: "BOTH" },
  { name: "Overhook Defense", keywords: ["overhook defense", "overhook defence"], type: "Defense", giType: "BOTH" },
  
  // Gripping/Clinch
  { name: "Collar Tie", keywords: ["collar tie"], type: "Control", giType: "BOTH" },
  { name: "Elbow Tie", keywords: ["elbow tie"], type: "Control", giType: "BOTH" },
  { name: "Wrist Control", keywords: ["wrist control"], type: "Control", giType: "BOTH" },
  { name: "Underhook", keywords: ["underhook"], type: "Control", giType: "BOTH" },
  { name: "Overhook", keywords: ["overhook"], type: "Control", giType: "BOTH" },
  { name: "Body Lock", keywords: ["body lock", "bodylock"], type: "Control", giType: "BOTH" },
  { name: "Front Headlock", keywords: ["front headlock"], type: "Control", giType: "BOTH" },
  
  // Specific grips
  { name: "Grip Fighting", keywords: ["grip fighting", "grip fight", "grip break"], type: "Control", giType: "BOTH" },
  { name: "Georgian Grip", keywords: ["georgian grip", "georgian"], type: "Control", giType: "GI" },
  { name: "High Crotch", keywords: ["high crotch", "high-crotch"], type: "Takedown", giType: "BOTH" },
  { name: "Low Single", keywords: ["low single"], type: "Takedown", giType: "BOTH" },
  
  // Finishes
  { name: "Trip Finish", keywords: ["trip finish"], type: "Takedown", giType: "BOTH" },
  { name: "Lift Finish", keywords: ["lift finish"], type: "Takedown", giType: "BOTH" },
  { name: "Dump", keywords: ["dump"], type: "Takedown", giType: "BOTH" },
  { name: "Cut the Corner", keywords: ["cut the corner", "cut corner"], type: "Takedown", giType: "BOTH" },
  
  // Top spin / scrambles
  { name: "Top Spin", keywords: ["top spin", "topspin"], type: "Transition", giType: "BOTH" },
  { name: "Scramble", keywords: ["scramble"], type: "Transition", giType: "BOTH" },
  { name: "Front Roll", keywords: ["front roll"], type: "Escape", giType: "BOTH" },
  { name: "Pancake", keywords: ["pancake"], type: "Takedown", giType: "BOTH" },
  { name: "Spladle", keywords: ["spladle"], type: "Control", giType: "BOTH" },
  
  // Guard pull counter
  { name: "Guard Pull Counter", keywords: ["guard pull counter", "counter guard pull"], type: "Defense", giType: "BOTH" },
  { name: "Imanari Roll Defense", keywords: ["imanari defense", "imanari defence"], type: "Defense", giType: "BOTH" },
  
  // Specific named techniques
  { name: "Collar Drag", keywords: ["collar drag"], type: "Takedown", giType: "GI" },
  { name: "Snap Down", keywords: ["snap down", "snapdown"], type: "Takedown", giType: "BOTH" },
  { name: "Arm Spin", keywords: ["arm spin"], type: "Takedown", giType: "BOTH" },
  { name: "Head Snap", keywords: ["head snap"], type: "Takedown", giType: "BOTH" },
  { name: "Post", keywords: ["post", "posting"], type: "Defense", giType: "BOTH" },
  { name: "Sprawl and Circle", keywords: ["sprawl and circle", "sprawl circle"], type: "Defense", giType: "BOTH" },
];

async function main() {
  const positionName = "Standing";

  // Get existing techniques in Standing position
  const existingTechniques = await prisma.technique.findMany();
  const existingNames = new Set(existingTechniques.map(t => t.name.toLowerCase()));
  console.log("Total existing techniques:", existingTechniques.length);

  // Get mapped videos
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));

  // Get all videos
  const videos = JSON.parse(fs.readFileSync("data/submissionsearcher-videos.json", "utf-8"));
  const unmapped = videos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));

  console.log("\nUnmapped videos:", unmapped.length);

  let techniquesCreated = 0;
  let videosMapped = 0;

  for (const tech of wrestlingTechniques) {
    // Check if technique already exists
    if (existingNames.has(tech.name.toLowerCase())) {
      // Still try to map videos to existing technique
      const technique = existingTechniques.find(t => t.name.toLowerCase() === tech.name.toLowerCase());
      if (technique) {
        const matchingVideos = unmapped.filter((v: any) => {
          const title = v.title.toLowerCase();
          return tech.keywords.some(kw => title.includes(kw));
        });
        if (matchingVideos.length > 0) {
          console.log(`  "${tech.name}" exists, mapping ${matchingVideos.length} videos`);
          for (const video of matchingVideos) {
            try {
              await prisma.techniqueVideo.create({
                data: {
                  techniqueId: technique.id,
                  url: video.youtubeUrl,
                  title: video.title,
                }
              });
              videosMapped++;
            } catch (e: any) {
              // Likely duplicate
            }
          }
        }
      }
      continue;
    }

    // Create the technique
    const technique = await prisma.technique.create({
      data: {
        name: tech.name,
        type: tech.type,
        position: positionName,
        giType: tech.giType,
      }
    });
    console.log(`  Created technique: ${tech.name}`);
    techniquesCreated++;
    existingNames.add(tech.name.toLowerCase());

    // Find matching unmapped videos
    const matchingVideos = unmapped.filter((v: any) => {
      const title = v.title.toLowerCase();
      return tech.keywords.some(kw => title.includes(kw));
    });

    if (matchingVideos.length > 0) {
      console.log(`    Found ${matchingVideos.length} videos for ${tech.name}`);

      for (const video of matchingVideos) {
        try {
          await prisma.techniqueVideo.create({
            data: {
              techniqueId: technique.id,
              url: video.youtubeUrl,
              title: video.title,
            }
          });
          videosMapped++;
        } catch (e: any) {
          // Likely duplicate
        }
      }
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Techniques created: ${techniquesCreated}`);
  console.log(`Videos mapped: ${videosMapped}`);

  await prisma.$disconnect();
}

main();
