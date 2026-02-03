import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

const positionKeywords: Record<string, string[]> = {
  "Standing/Takedowns": ["takedown", "wrestling", "judo", "throw", "trip", "snap down", "ankle pick", "single leg", "double leg", "fireman", "suplex", "clinch", "standing", "feet"],
  "Guard Pull/Entries": ["guard pull", "sit up guard", "pull guard", "butt scoot"],
  "Closed Guard": ["closed guard"],
  "Half Guard": ["half guard", "deep half", "knee shield", "z guard", "z-guard"],
  "Butterfly Guard": ["butterfly", "seated guard"],
  "De La Riva": ["de la riva", "dlr", "dela riva"],
  "Spider Guard": ["spider guard", "spider"],
  "Lasso Guard": ["lasso"],
  "X-Guard": ["x guard", "x-guard", "single leg x", "slx"],
  "Collar Sleeve": ["collar sleeve", "collar and sleeve"],
  "Reverse De La Riva": ["reverse de la riva", "rdlr", "reverse dlr"],
  "50/50": ["50/50", "fifty fifty", "5050"],
  "Open Guard (Other)": ["open guard", "seated", "sit up"],
  "Side Control": ["side control", "side mount", "100 kilos", "kesa gatame", "scarf hold"],
  "Mount": ["mount", "mounted", "s mount", "s-mount", "technical mount"],
  "Back Control": ["back control", "back mount", "rear mount", "back take", "seatbelt", "hooks"],
  "Turtle": ["turtle"],
  "North-South": ["north south", "north-south"],
  "Knee on Belly": ["knee on belly", "kob", "knee ride"],
  "Leg Entanglement": ["leg entangle", "ashi garami", "inside sankaku", "outside sankaku", "411", "4-11", "saddle", "honey hole"],
  "Guard Pass": ["guard pass", "passing", "toreando", "knee cut", "knee slice", "over under", "stack pass", "leg drag", "smash pass", "pressure pass", "x pass", "bullfighter"],
  "Sweeps": ["sweep", "elevator", "hip bump", "scissor", "flower", "pendulum"],
  "Submissions - Chokes": ["choke", "strangle", "rnc", "rear naked", "guillotine", "darce", "d arce", "anaconda", "triangle", "bow and arrow", "ezekiel", "loop choke", "cross collar", "baseball bat", "north south choke", "arm triangle", "kata gatame", "clock choke", "paper cutter"],
  "Submissions - Armlocks": ["armbar", "arm bar", "kimura", "americana", "omoplata", "wrist lock", "shoulder lock", "straight arm"],
  "Submissions - Leg Locks": ["leg lock", "heel hook", "knee bar", "kneebar", "toe hold", "calf slicer", "calf crush", "ankle lock", "straight ankle", "achilles"],
  "Escapes": ["escape", "defense", "defend", "counter", "survival"],
  "Transitions": ["transition", "scramble", "reguard", "re-guard"],
};

async function main() {
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));
  
  const videos = JSON.parse(fs.readFileSync("data/submissionsearcher-videos.json", "utf-8"));
  const unmapped = videos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));
  
  const grouped: Record<string, any[]> = {};
  const uncategorized: any[] = [];
  
  for (const video of unmapped) {
    const title = video.title.toLowerCase();
    let found = false;
    
    for (const [position, keywords] of Object.entries(positionKeywords)) {
      if (keywords.some(kw => title.includes(kw))) {
        if (!grouped[position]) grouped[position] = [];
        grouped[position].push(video);
        found = true;
        break;
      }
    }
    
    if (!found) {
      uncategorized.push(video);
    }
  }
  
  console.log("=== UNMAPPED VIDEOS BY POSITION ===\n");
  
  const sorted = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
  for (const [position, vids] of sorted) {
    console.log(`${position}: ${vids.length}`);
  }
  
  console.log(`\nUncategorized: ${uncategorized.length}`);
  console.log(`\nTotal unmapped: ${unmapped.length}`);
  
  console.log("\n=== SAMPLE UNCATEGORIZED TITLES ===\n");
  uncategorized.slice(0, 40).forEach(v => console.log("  - " + v.title));
  
  await prisma.$disconnect();
}

main();
