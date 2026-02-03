import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// Techniques to create for various positions
const techniquesToCreate: Array<{
  name: string;
  keywords: string[];
  position: string;
  type: string;
  giType: "BOTH" | "GI" | "NOGI";
}> = [
  // Guard Passes
  { name: "Toreando Pass", keywords: ["toreando", "toreano", "bullfighter pass"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Knee Cut Pass", keywords: ["knee cut", "knee slice", "knee slide"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Stack Pass", keywords: ["stack pass", "stacking"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Over Under Pass", keywords: ["over under", "over-under"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Leg Drag Pass", keywords: ["leg drag"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Smash Pass", keywords: ["smash pass"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "X Pass", keywords: ["x pass", "x-pass"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Leg Weave Pass", keywords: ["leg weave"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Folding Pass", keywords: ["folding pass", "fold pass"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Body Lock Pass", keywords: ["body lock pass", "bodylock pass"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Long Step Pass", keywords: ["long step"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  { name: "Cartwheel Pass", keywords: ["cartwheel pass"], position: "Guard Passing", type: "Pass", giType: "BOTH" },
  
  // Chokes - various positions
  { name: "Ezekiel Choke", keywords: ["ezekiel"], position: "Side Control Top", type: "Submission", giType: "BOTH" },
  { name: "Baseball Bat Choke", keywords: ["baseball bat", "baseball choke"], position: "Side Control Top", type: "Submission", giType: "GI" },
  { name: "Paper Cutter Choke", keywords: ["paper cutter", "papercutter"], position: "Side Control Top", type: "Submission", giType: "GI" },
  { name: "Bread Cutter Choke", keywords: ["bread cutter", "breadcutter"], position: "Side Control Top", type: "Submission", giType: "GI" },
  { name: "Von Flue Choke", keywords: ["von flue"], position: "Side Control Top", type: "Submission", giType: "BOTH" },
  { name: "Clock Choke", keywords: ["clock choke"], position: "Turtle Top", type: "Submission", giType: "GI" },
  { name: "Loop Choke", keywords: ["loop choke"], position: "Closed Guard", type: "Submission", giType: "GI" },
  { name: "Buggy Choke", keywords: ["buggy choke"], position: "Guard Bottom", type: "Submission", giType: "BOTH" },
  { name: "Peruvian Necktie", keywords: ["peruvian necktie"], position: "Front Headlock", type: "Submission", giType: "BOTH" },
  { name: "Japanese Necktie", keywords: ["japanese necktie"], position: "Front Headlock", type: "Submission", giType: "BOTH" },
  { name: "Brabo Choke", keywords: ["brabo choke"], position: "Side Control Top", type: "Submission", giType: "BOTH" },
  { name: "North South Choke", keywords: ["north south choke", "north-south choke"], position: "North South Top", type: "Submission", giType: "BOTH" },
  { name: "Arm-In Guillotine", keywords: ["arm in guillotine", "arm-in guillotine"], position: "Front Headlock", type: "Submission", giType: "BOTH" },
  { name: "High Elbow Guillotine", keywords: ["high elbow guillotine", "marcelotine"], position: "Front Headlock", type: "Submission", giType: "BOTH" },
  { name: "Power Guillotine", keywords: ["power guillotine"], position: "Front Headlock", type: "Submission", giType: "BOTH" },
  { name: "Bow and Arrow Choke", keywords: ["bow and arrow"], position: "Back Control", type: "Submission", giType: "GI" },
  { name: "Sliding Collar Choke", keywords: ["sliding collar"], position: "Back Control", type: "Submission", giType: "GI" },
  { name: "Short Choke", keywords: ["short choke"], position: "Back Control", type: "Submission", giType: "BOTH" },
  
  // Turtle attacks
  { name: "Spiral Ride", keywords: ["spiral ride"], position: "Turtle Top", type: "Control", giType: "BOTH" },
  { name: "Turk Ride", keywords: ["turk ride", "turk"], position: "Turtle Top", type: "Control", giType: "BOTH" },
  { name: "Crucifix", keywords: ["crucifix"], position: "Turtle Top", type: "Control", giType: "BOTH" },
  { name: "Truck Position", keywords: ["truck position", "truck"], position: "Back Control", type: "Control", giType: "BOTH" },
  { name: "Twister", keywords: ["twister"], position: "Back Control", type: "Submission", giType: "BOTH" },
  { name: "Calf Slicer from Truck", keywords: ["calf slicer"], position: "Back Control", type: "Submission", giType: "BOTH" },
  
  // Leg locks
  { name: "Straight Ankle Lock", keywords: ["straight ankle", "ankle lock"], position: "Leg Entanglement", type: "Submission", giType: "BOTH" },
  { name: "Inside Heel Hook", keywords: ["inside heel hook"], position: "Leg Entanglement", type: "Submission", giType: "NOGI" },
  { name: "Outside Heel Hook", keywords: ["outside heel hook"], position: "Leg Entanglement", type: "Submission", giType: "NOGI" },
  { name: "Toe Hold", keywords: ["toe hold"], position: "Leg Entanglement", type: "Submission", giType: "BOTH" },
  { name: "Kneebar", keywords: ["kneebar", "knee bar"], position: "Leg Entanglement", type: "Submission", giType: "BOTH" },
  { name: "Calf Slicer", keywords: ["calf slicer", "calf crush"], position: "Leg Entanglement", type: "Submission", giType: "BOTH" },
  { name: "Estima Lock", keywords: ["estima lock"], position: "Leg Entanglement", type: "Submission", giType: "BOTH" },
  { name: "Aoki Lock", keywords: ["aoki lock"], position: "Leg Entanglement", type: "Submission", giType: "BOTH" },
  
  // Sweeps
  { name: "Scissor Sweep", keywords: ["scissor sweep"], position: "Closed Guard", type: "Sweep", giType: "BOTH" },
  { name: "Hip Bump Sweep", keywords: ["hip bump"], position: "Closed Guard", type: "Sweep", giType: "BOTH" },
  { name: "Flower Sweep", keywords: ["flower sweep"], position: "Closed Guard", type: "Sweep", giType: "BOTH" },
  { name: "Pendulum Sweep", keywords: ["pendulum sweep"], position: "Closed Guard", type: "Sweep", giType: "BOTH" },
  { name: "Elevator Sweep", keywords: ["elevator sweep"], position: "Butterfly Guard", type: "Sweep", giType: "BOTH" },
  { name: "Sickle Sweep", keywords: ["sickle sweep"], position: "De La Riva Guard", type: "Sweep", giType: "BOTH" },
  { name: "Balloon Sweep", keywords: ["balloon sweep"], position: "Open Guard", type: "Sweep", giType: "BOTH" },
  { name: "Tripod Sweep", keywords: ["tripod sweep"], position: "Open Guard", type: "Sweep", giType: "BOTH" },
  { name: "Dummy Sweep", keywords: ["dummy sweep"], position: "Half Guard", type: "Sweep", giType: "BOTH" },
  { name: "Old School Sweep", keywords: ["old school sweep"], position: "Half Guard", type: "Sweep", giType: "BOTH" },
  { name: "Plan B Sweep", keywords: ["plan b sweep"], position: "Half Guard", type: "Sweep", giType: "BOTH" },
  { name: "Electric Chair Sweep", keywords: ["electric chair"], position: "Half Guard", type: "Sweep", giType: "BOTH" },
  { name: "Waiter Sweep", keywords: ["waiter sweep"], position: "Half Guard", type: "Sweep", giType: "BOTH" },
  
  // Escapes
  { name: "Shrimp Escape", keywords: ["shrimp escape", "shrimping", "hip escape"], position: "Side Control Bottom", type: "Escape", giType: "BOTH" },
  { name: "Bridge Escape", keywords: ["bridge escape", "upa escape"], position: "Mount Bottom", type: "Escape", giType: "BOTH" },
  { name: "Elbow Escape", keywords: ["elbow escape", "elbow knee"], position: "Mount Bottom", type: "Escape", giType: "BOTH" },
  { name: "Ghost Escape", keywords: ["ghost escape"], position: "Side Control Bottom", type: "Escape", giType: "BOTH" },
  { name: "Running Escape", keywords: ["running escape", "running man"], position: "Side Control Bottom", type: "Escape", giType: "BOTH" },
  { name: "Back Door Escape", keywords: ["back door escape"], position: "Side Control Bottom", type: "Escape", giType: "BOTH" },
  
  // Armlocks
  { name: "Belly Down Armbar", keywords: ["belly down armbar"], position: "Back Control", type: "Submission", giType: "BOTH" },
  { name: "Spinning Armbar", keywords: ["spinning armbar"], position: "Guard Bottom", type: "Submission", giType: "BOTH" },
  { name: "Juji Gatame", keywords: ["juji gatame"], position: "Guard Bottom", type: "Submission", giType: "BOTH" },
  { name: "Reverse Armbar", keywords: ["reverse armbar"], position: "Mount Top", type: "Submission", giType: "BOTH" },
  { name: "Straight Armbar", keywords: ["straight armbar"], position: "Guard Bottom", type: "Submission", giType: "BOTH" },
  
  // Wristlocks
  { name: "Wristlock", keywords: ["wristlock", "wrist lock"], position: "Various", type: "Submission", giType: "BOTH" },
  
  // Back takes
  { name: "Chair Sit Back Take", keywords: ["chair sit"], position: "Guard Bottom", type: "Transition", giType: "BOTH" },
  { name: "Kiss of the Dragon", keywords: ["kiss of the dragon"], position: "De La Riva Guard", type: "Transition", giType: "BOTH" },
  { name: "Berimbolo", keywords: ["berimbolo"], position: "De La Riva Guard", type: "Transition", giType: "BOTH" },
  { name: "Crab Ride", keywords: ["crab ride"], position: "Turtle Top", type: "Control", giType: "BOTH" },
  
  // Other
  { name: "Gator Roll", keywords: ["gator roll"], position: "Various", type: "Transition", giType: "BOTH" },
  { name: "Diesel Squeezel", keywords: ["diesel squeezel"], position: "Front Headlock", type: "Submission", giType: "BOTH" },
  { name: "Mir Lock", keywords: ["mir lock"], position: "Guard Bottom", type: "Submission", giType: "BOTH" },
  { name: "Boston Crab", keywords: ["boston crab"], position: "Guard Pass", type: "Submission", giType: "BOTH" },
];

async function main() {
  // Get mapped videos
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));

  // Get all videos
  const videos = JSON.parse(fs.readFileSync("data/submissionsearcher-videos.json", "utf-8"));
  const unmapped = videos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));

  console.log("Unmapped videos:", unmapped.length);

  // Get existing techniques
  const existingTechniques = await prisma.technique.findMany();
  const existingByNamePosition = new Map<string, any>();
  for (const t of existingTechniques) {
    existingByNamePosition.set(`${t.name.toLowerCase()}|${t.position.toLowerCase()}`, t);
  }

  let techniquesCreated = 0;
  let videosMapped = 0;

  for (const tech of techniquesToCreate) {
    const key = `${tech.name.toLowerCase()}|${tech.position.toLowerCase()}`;
    let technique = existingByNamePosition.get(key);

    if (!technique) {
      // Check if technique exists in any position
      const existingAny = existingTechniques.find(t => t.name.toLowerCase() === tech.name.toLowerCase());
      if (existingAny) {
        technique = existingAny;
        console.log(`  Using existing "${tech.name}" from ${existingAny.position}`);
      } else {
        // Create the technique
        try {
          technique = await prisma.technique.create({
            data: {
              name: tech.name,
              type: tech.type,
              position: tech.position,
              giType: tech.giType,
            }
          });
          console.log(`  Created technique: ${tech.name} (${tech.position})`);
          techniquesCreated++;
          existingByNamePosition.set(key, technique);
        } catch (e: any) {
          console.log(`  Error creating ${tech.name}: ${e.message}`);
          continue;
        }
      }
    } else {
      console.log(`  Technique "${tech.name}" already exists`);
    }

    if (!technique) continue;

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
