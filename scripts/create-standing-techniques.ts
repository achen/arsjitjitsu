import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// Standing techniques to create and their keyword patterns
const standingTechniques: Array<{
  name: string;
  keywords: string[];
  type: string;
  giType: "BOTH" | "GI" | "NOGI";
}> = [
  { name: "Funk Roll", keywords: ["funk roll", "funk"], type: "Escape", giType: "BOTH" },
  { name: "Peterson Roll", keywords: ["peterson roll", "peterson standup", "peterson"], type: "Escape", giType: "BOTH" },
  { name: "Granby Roll", keywords: ["granby roll", "granby"], type: "Escape", giType: "BOTH" },
  { name: "Sprawl", keywords: ["sprawl"], type: "Defense", giType: "BOTH" },
  { name: "Arm Drag", keywords: ["arm drag"], type: "Takedown", giType: "BOTH" },
  { name: "Duck Under", keywords: ["duck under"], type: "Takedown", giType: "BOTH" },
  { name: "Russian Tie", keywords: ["russian tie", "2 on 1", "two on one"], type: "Control", giType: "BOTH" },
  { name: "Front Headlock", keywords: ["front headlock"], type: "Control", giType: "BOTH" },
  { name: "Snap Down", keywords: ["snap down", "snapdown"], type: "Takedown", giType: "BOTH" },
  { name: "Collar Tie", keywords: ["collar tie"], type: "Control", giType: "BOTH" },
  { name: "Underhook", keywords: ["underhook"], type: "Control", giType: "BOTH" },
  { name: "Lateral Drop", keywords: ["lateral drop"], type: "Takedown", giType: "BOTH" },
  { name: "Fireman's Carry", keywords: ["fireman carry", "firemans carry", "fireman's carry"], type: "Takedown", giType: "BOTH" },
  { name: "High Crotch", keywords: ["high crotch", "high-crotch"], type: "Takedown", giType: "BOTH" },
  { name: "Low Single", keywords: ["low single"], type: "Takedown", giType: "BOTH" },
  { name: "Blast Double", keywords: ["blast double"], type: "Takedown", giType: "BOTH" },
  { name: "Body Lock Takedown", keywords: ["body lock takedown", "bodylock takedown"], type: "Takedown", giType: "BOTH" },
  { name: "Inside Trip", keywords: ["inside trip"], type: "Takedown", giType: "BOTH" },
  { name: "Outside Trip", keywords: ["outside trip"], type: "Takedown", giType: "BOTH" },
  { name: "Foot Sweep", keywords: ["foot sweep"], type: "Takedown", giType: "BOTH" },
  // Judo throws
  { name: "Uchi Mata", keywords: ["uchi mata", "uchi-mata"], type: "Takedown", giType: "GI" },
  { name: "Seoi Nage", keywords: ["seoi nage", "seoi-nage", "ippon seoi"], type: "Takedown", giType: "GI" },
  { name: "Osoto Gari", keywords: ["osoto gari", "o soto gari", "o-soto-gari"], type: "Takedown", giType: "GI" },
  { name: "Ouchi Gari", keywords: ["ouchi gari", "o uchi gari", "o-uchi-gari"], type: "Takedown", giType: "GI" },
  { name: "Kouchi Gari", keywords: ["kouchi gari", "ko uchi gari", "ko-uchi-gari"], type: "Takedown", giType: "GI" },
  { name: "Tai Otoshi", keywords: ["tai otoshi", "tai-otoshi"], type: "Takedown", giType: "GI" },
  { name: "Harai Goshi", keywords: ["harai goshi", "harai-goshi"], type: "Takedown", giType: "GI" },
  { name: "Tomoe Nage", keywords: ["tomoe nage", "tomoe-nage"], type: "Takedown", giType: "GI" },
  { name: "Sumi Gaeshi", keywords: ["sumi gaeshi", "sumi-gaeshi"], type: "Takedown", giType: "GI" },
  { name: "Yoko Guruma", keywords: ["yoko guruma"], type: "Takedown", giType: "GI" },
  { name: "Hiza Guruma", keywords: ["hiza guruma", "hiza-guruma"], type: "Takedown", giType: "GI" },
  { name: "Sasae Tsurikomi Ashi", keywords: ["sasae", "tsurikomi ashi"], type: "Takedown", giType: "GI" },
  { name: "Uki Otoshi", keywords: ["uki otoshi", "uki-otoshi"], type: "Takedown", giType: "GI" },
  { name: "Yoko Otoshi", keywords: ["yoko otoshi", "yoko-otoshi"], type: "Takedown", giType: "GI" },
  { name: "Uki Waza", keywords: ["uki waza", "uki-waza"], type: "Takedown", giType: "GI" },
  { name: "Kosoto Gari", keywords: ["kosoto gari", "ko soto gari", "ko-soto-gari"], type: "Takedown", giType: "GI" },
  { name: "Kosoto Gake", keywords: ["kosoto gake", "ko soto gake"], type: "Takedown", giType: "GI" },
  { name: "Deashi Barai", keywords: ["deashi barai", "de ashi barai"], type: "Takedown", giType: "GI" },
  { name: "Ura Nage", keywords: ["ura nage", "uranage"], type: "Takedown", giType: "GI" },
  { name: "Makikomi", keywords: ["makikomi"], type: "Takedown", giType: "GI" },
  { name: "Obi Otoshi", keywords: ["obi otoshi"], type: "Takedown", giType: "GI" },
  { name: "Kata Guruma", keywords: ["kata guruma"], type: "Takedown", giType: "GI" },
  { name: "Drop Seoi Nage", keywords: ["drop seoi", "drop seoi nage"], type: "Takedown", giType: "GI" },
  // Wrestling standup
  { name: "Sit Out", keywords: ["sit out", "sitout"], type: "Escape", giType: "BOTH" },
  { name: "Switch", keywords: ["switch wrestling", "wrestling switch"], type: "Escape", giType: "BOTH" },
  { name: "Stand Up (Base)", keywords: ["stand up", "standup", "standing up"], type: "Escape", giType: "BOTH" },
  { name: "Limp Arm", keywords: ["limp arm"], type: "Escape", giType: "BOTH" },
];

async function main() {
  const positionName = "Standing";

  // Get existing techniques in Standing position
  const existingTechniques = await prisma.technique.findMany({
    where: { position: positionName }
  });
  const existingNames = new Set(existingTechniques.map(t => t.name.toLowerCase()));
  console.log("Existing Standing techniques:", existingTechniques.length);

  // Get mapped videos
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));

  // Get all videos
  const videos = JSON.parse(fs.readFileSync("data/submissionsearcher-videos.json", "utf-8"));
  const unmapped = videos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));

  console.log("\nUnmapped videos:", unmapped.length);

  let techniquesCreated = 0;
  let videosMapped = 0;

  for (const tech of standingTechniques) {
    // Check if technique already exists
    if (existingNames.has(tech.name.toLowerCase())) {
      console.log(`  Technique "${tech.name}" already exists, skipping creation`);
    } else {
      // Create the technique
      await prisma.technique.create({
        data: {
          name: tech.name,
          type: tech.type,
          position: positionName,
          giType: tech.giType,
        }
      });
      console.log(`  Created technique: ${tech.name}`);
      techniquesCreated++;
    }

    // Get the technique (whether just created or existing)
    const technique = await prisma.technique.findFirst({
      where: { name: tech.name, position: positionName }
    });

    if (!technique) {
      console.log(`  Could not find technique ${tech.name}`);
      continue;
    }

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
          // Likely duplicate - video already mapped to this technique
          if (!e.message?.includes("Unique constraint")) {
            console.log(`    Error mapping ${video.title}: ${e.message}`);
          }
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
